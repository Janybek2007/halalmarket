from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Order, OrderItem, OrderItemStatus, OrderStatus


@receiver(post_save, sender=OrderItem)
def update_order_status_on_item_change(sender, instance, **kwargs):
    """
    При изменении статуса OrderItem проверяем все items заказа.
    Если все items имеют одинаковый статус - обновляем статус Order.
    """
    order = instance.order
    all_items = order.sub_orders.all()

    if not all_items.exists():
        return

    # Получаем все статусы items
    item_statuses = set(all_items.values_list("status", flat=True))

    # Если все items имеют статус SHIPPED
    if item_statuses == {OrderItemStatus.SHIPPED}:
        if order.status != OrderStatus.SHIPPED:
            order.status = OrderStatus.SHIPPED
            order.save(update_fields=["status"])
            # Отправляем уведомление покупателю
            _send_order_shipped_notification(order)

    # Если все items имеют статус DELIVERED
    elif item_statuses == {OrderItemStatus.DELIVERED}:
        if order.status != OrderStatus.DELIVERED:
            order.status = OrderStatus.DELIVERED
            order.save(update_fields=["status"])

    # Если все items имеют статус CANCELLED или RETURNED
    elif item_statuses <= {OrderItemStatus.CANCELLED, OrderItemStatus.RETURNED}:
        if order.status != OrderStatus.CANCELLED:
            order.status = OrderStatus.CANCELLED
            order.save(update_fields=["status"])


@receiver(post_save, sender=Order)
def mark_items_return_requested(sender, instance: Order, created, **kwargs):
    """
    Если статус Order изменился на CANCELLATION_REQUESTED,
    все дочерние OrderItem переводим в RETURN_REQUESTED,
    если они ещё не в RETURNED или CANCELLED.
    """
    if instance.status != OrderStatus.CANCELLATION_REQUESTED:
        return

    # Получаем только те OrderItem, которые можно вернуть
    items_to_update = instance.sub_orders.exclude(
        status__in=[OrderItemStatus.RETURNED, OrderItemStatus.CANCELLED]
    )

    if not items_to_update.exists():
        return

    with transaction.atomic():
        for item in items_to_update:
            item.status = OrderItemStatus.RETURN_REQUESTED
            item.save(update_fields=["status"])


def _send_order_shipped_notification(order):
    """Отправить уведомление покупателю что заказ отправлен"""
    from .serializers import OrderSerializer
    from .tasks import send_orders_shipped_notification

    if not order.user:
        return

    # Собираем названия магазинов всех продавцов
    seller_names = list(
        order.sub_orders.values_list("seller__store_name", flat=True).distinct()
    )
    store_name = ", ".join(seller_names) if seller_names else "Магазин"

    serialized_order = OrderSerializer(order).data

    send_orders_shipped_notification.delay(
        user_id=int(order.user.id),
        store_name=store_name,
        orders_data=[serialized_order],
        total_orders=1,
    )
