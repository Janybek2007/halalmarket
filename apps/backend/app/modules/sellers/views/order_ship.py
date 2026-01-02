from django.db.models import Prefetch
from modules.orders.models import Order, OrderGroup, OrderStatus
from modules.orders.serializers import OrderSerializer
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class SellerOrderShipView(SellerBaseView):
    def post(self, request):
        user = request.user
        if not hasattr(user, "seller_profile"):
            from modules.users.models import Seller

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

        order_groups = (
            OrderGroup.objects.filter(
                id__in=order_ids, orders__product__store__seller=seller
            )
            .exclude(status=OrderStatus.CANCELLED)
            .prefetch_related(
                Prefetch(
                    "orders", queryset=Order.objects.select_related("product__store")
                )
            )
            .select_related("user")
        )

        if not order_groups:
            return Response(
                {"error": "Заказы не найдены или нет доступа"},
                status=status.HTTP_404_NOT_FOUND,
            )

        updated_ids = []
        for group in order_groups:
            group.status = OrderStatus.SHIPPED
            group.save()
            updated_ids.extend([int(order.id )for order in group.orders.all()])

        user_orders = {}
        for group in order_groups:
            if group.user_id not in user_orders:
                user_orders[group.user_id] = {"user": group.user, "orders": []}
            user_orders[group.user_id]["orders"].extend(group.orders.all())

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
                store_name=seller.store.name,
                orders_data=serialized_orders,
                total_orders=total_orders,
            )

        return Response({"success": True, "updated_orders": updated_ids})
