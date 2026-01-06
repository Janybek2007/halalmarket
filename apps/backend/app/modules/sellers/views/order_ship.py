from django.db.models import Prefetch
from modules.orders.models import Order, OrderItem, OrderStatus
from modules.orders.serializers import OrderSerializer
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class SellerOrderShipView(SellerBaseView):
    def post(self, request):
        user = request.user
        if not hasattr(user, "seller_profile"):
            from modules.sellers.models import Seller

            try:
                seller = Seller.objects.get(user=user)
            except Seller.DoesNotExist:
                return Response(
                    {"error": "Профиль продавца не найден"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            seller = user.seller_profile

        order_ids = request.data.get("ids", [])

        if not order_ids:
            return Response(
                {"error": "Не указаны ID заказов"}, status=status.HTTP_400_BAD_REQUEST
            )

        orders = (
            Order.objects.filter(id__in=order_ids, items__seller=seller)
            .exclude(status=OrderStatus.CANCELLED)
            .select_related("user")
            .prefetch_related(
                Prefetch("items", queryset=OrderItem.objects.select_related("product"))
            )
        )

        if not orders:
            return Response(
                {"error": "Заказы не найдены или нет доступа"},
                status=status.HTTP_404_NOT_FOUND,
            )

        updated_ids = []
        for order in orders:
            order.status = OrderStatus.SHIPPED
            order.save()
            updated_ids.append(int(order.id))

        user_orders = {}
        for order in orders:
            if order.user_id not in user_orders:
                user_orders[order.user_id] = {"user": order.user, "orders": []}
            user_orders[order.user_id]["orders"].append(order)

        from modules.orders.tasks import send_orders_shipped_notification

        for user_data in user_orders.values():
            user = user_data["user"]
            user_order_list = user_data["orders"]
            total_orders = len(user_order_list)

            serialized_orders = [
                OrderSerializer(order).data for order in user_order_list
            ]

            send_orders_shipped_notification.delay(
                user_id=int(user.id),
                store_name=seller.store_name,
                orders_data=serialized_orders,
                total_orders=total_orders,
            )

        return Response({"success": True, "updated_orders": updated_ids})
