from django.db import transaction
from django.utils import timezone
from modules.orders.models import OrderItemStatus
from modules.sellers.services import SellerBalanceService
from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Order, OrderStatus
from ..serializers import OrderSerializer


class OrderUpdateStatusView(APIView):
    """
    View для покупателя - обновление статуса заказа.

    Разрешенные переходы:
    - PENDING -> CANCELLED (отмена до отправки)
    - SHIPPED -> DELIVERED (подтверждение получения)
    - SHIPPED -> CANCELLATION_REQUESTED (запрос возврата)
    """

    permission_classes = [IsUser]

    VALID_TRANSITIONS = {
        OrderStatus.PENDING: [OrderStatus.CANCELLED],
        OrderStatus.SHIPPED: [
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLATION_REQUESTED,
        ],
    }

    VALID_STATUSES = [
        OrderStatus.CANCELLED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLATION_REQUESTED,
    ]

    @transaction.atomic
    def post(self, request):
        ids = request.data.get("ids", [])
        if not isinstance(ids, list):
            return Response(
                {"error": "Поле 'ids' должно быть массивом"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_status = request.data.get("status")
        if not new_status:
            return Response(
                {"error": "Статус не указан"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_status not in self.VALID_STATUSES:
            return Response(
                {
                    "error": f"Недействительный статус. Допустимые значения: {', '.join(self.VALID_STATUSES)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        orders = (
            Order.objects.filter(id__in=ids, user=request.user)
            .select_for_update()
            .prefetch_related("sub_orders__seller", "sub_orders__product")
        )

        if not orders:
            return Response(
                {"error": "Заказы не найдены"},
                status=status.HTTP_404_NOT_FOUND,
            )

        updated_ids = []
        seller_orders = {}

        for order in orders:
            # Проверяем разрешен ли переход
            allowed = self.VALID_TRANSITIONS.get(order.status, [])
            if new_status not in allowed:
                continue

            if new_status == OrderStatus.DELIVERED:
                order.status = OrderStatus.DELIVERED
                order.delivery_date = timezone.now()
                order.save()

                # Разморозка средств - перевод из hold в available
                for item in order.sub_orders.all():
                    if item.status != OrderItemStatus.DELIVERED:
                        item.status = OrderItemStatus.DELIVERED
                        item.save(update_fields=["status"])

                    SellerBalanceService.release_from_hold(
                        seller=item.seller,
                        amount=item.total_amount,
                        order_item=item,
                    )

            elif new_status == OrderStatus.CANCELLED:
                # Отмена заказа (только из PENDING)
                order.status = OrderStatus.CANCELLED
                order.save()

                # Возврат средств с hold
                for item in order.sub_orders.all():
                    SellerBalanceService.refund_from_hold(
                        seller=item.seller,
                        amount=item.total_amount,
                        order_item=item,
                    )

            elif new_status == OrderStatus.CANCELLATION_REQUESTED:
                # Запрос на возврат (только из SHIPPED)
                order.status = OrderStatus.CANCELLATION_REQUESTED
                order.save()
                # Средства остаются в hold до подтверждения продавцом

            updated_ids.append(int(order.id))

            # Группируем по продавцам для уведомлений
            for item in order.sub_orders.all():
                seller_id = item.seller.id
                if seller_id not in seller_orders:
                    seller_orders[seller_id] = {
                        "seller": item.seller,
                        "store_name": (
                            item.seller.store_name
                            if hasattr(item.seller, "store_name")
                            else "Магазин"
                        ),
                        "orders": [],
                    }
                if order not in seller_orders[seller_id]["orders"]:
                    seller_orders[seller_id]["orders"].append(order)

        if not updated_ids:
            return Response(
                {"error": "Нет заказов для обновления с указанным статусом"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Отправка уведомлений продавцам
        from ..tasks import send_seller_order_status_notification

        for seller_data in seller_orders.values():
            seller = seller_data["seller"]
            seller_orders_list = seller_data["orders"]
            store_name = seller_data["store_name"]

            serialized_orders = [
                OrderSerializer(order).data for order in seller_orders_list
            ]

            send_seller_order_status_notification.delay(
                seller_user_id=int(seller.user.id),
                store_name=store_name,
                status_value=new_status,
                orders_data=serialized_orders,
                total_orders=len(seller_orders_list),
            )

        return Response(
            {"success": True, "updated": updated_ids}, status=status.HTTP_200_OK
        )
