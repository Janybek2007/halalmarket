from django.db import transaction
from modules.orders.models import Order, OrderItem, OrderItemStatus, OrderStatus
from modules.sellers.services import SellerBalanceService
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class SellerUpdateOrderItemStatusView(SellerBaseView):
    """
    Продавец обновляет статус своих товаров в заказе.
    Поддерживаются статусы:
    - shipped — отправка товара
    - returned — подтверждение возврата
    """

    VALID_STATUSES = [
        OrderItemStatus.SHIPPED,
        OrderItemStatus.RETURNED,
    ]

    @transaction.atomic
    def post(self, request):
        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_403_FORBIDDEN,
            )

        order_ids = request.data.get("ids", [])
        new_status = request.data.get("status")

        if not order_ids or not isinstance(order_ids, list):
            return Response(
                {"error": "Поле 'ids' должно быть непустым массивом"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_status not in self.VALID_STATUSES:
            return Response(
                {
                    "error": f"Недопустимый статус. Допустимые: {', '.join(self.VALID_STATUSES)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Определяем фильтр по текущему статусу
        if new_status == OrderItemStatus.SHIPPED:
            current_status = OrderItemStatus.PROCESSING
            order_status_filter = OrderStatus.PENDING
        elif new_status == OrderItemStatus.RETURNED:
            current_status = OrderItemStatus.RETURN_REQUESTED
            order_status_filter = OrderStatus.CANCELLATION_REQUESTED
        else:
            return Response(
                {"error": "Неподдерживаемый статус"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Блокируем строки для обновления
        items = (
            OrderItem.objects.select_for_update()
            .filter(
                order_id__in=order_ids,
                seller=seller,
                status=current_status,
                order__status=order_status_filter,
            )
            .select_related("order", "order__user")
        )

        if not items.exists():
            return Response(
                {
                    "error": "Товары не найдены или их нельзя обновить до указанного статуса"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        updated_orders = set()

        for item in items:
            if new_status == OrderItemStatus.RETURNED:
                # Возврат средств с hold
                SellerBalanceService.refund_from_hold(
                    seller=item.seller,
                    amount=item.total_amount,
                    order_item=item,
                )

            item.status = new_status
            item.save(update_fields=["status"])
            updated_orders.add(item.order_id)

        # Отправка уведомлений пользователям
        from modules.orders.tasks import send_return_confirmed_notification

        if new_status == OrderItemStatus.RETURNED:
            for order_id in updated_orders:
                order = Order.objects.get(id=order_id)
                if order.user:
                    send_return_confirmed_notification.delay(
                        user_id=int(order.user.id),
                        order_id=order.id,
                        store_name=seller.store_name,
                    )

        return Response(
            {
                "success": True,
                "updated_orders": list(updated_orders),
                "updated_items": items.count(),
            },
            status=status.HTTP_200_OK,
        )
