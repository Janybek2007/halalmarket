from django.utils import timezone
from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Order, OrderStatus
from ..serializers import OrderSerializer


class OrderUpdateStatusView(APIView):
    permission_classes = [IsUser]

    def post(self, request):
        """
        Отметить заказы как доставленные
        """
        ids = request.data.get("ids", [])
        if not isinstance(ids, list):
            return Response(
                {"error": "Поле 'ids' должно быть массивом"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        status_value = request.data.get("status")
        if not status_value or status_value not in [
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED,
        ]:
            return Response(
                {
                    "error": "Недействительный статус. Допустимые значения: delivered, cancelled"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        orders = (
            Order.objects.filter(id__in=ids, user=request.user)
            .exclude(
                status__in=[
                    OrderStatus.DELIVERED,
                    OrderStatus.CANCELLED,
                ]
            )
            .select_related("user")
            .prefetch_related("items__product", "items__seller")
        )

        if not orders:
            return Response(
                {"error": "Заказы не найдены или уже обработаны"},
                status=status.HTTP_404_NOT_FOUND,
            )

        updated_ids = []
        seller_orders = {}

        for order in orders:
            order.status = status_value
            if status_value == OrderStatus.DELIVERED:
                order.delivery_date = timezone.now()
            order.save()

            updated_ids.append(int(order.id))

            # Получаем продавцов через items
            for item in order.items.all():
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
                status_value=status_value,
                orders_data=serialized_orders,
                total_orders=len(seller_orders_list),
            )

        return Response(
            {"success": True, "updated": updated_ids}, status=status.HTTP_200_OK
        )
