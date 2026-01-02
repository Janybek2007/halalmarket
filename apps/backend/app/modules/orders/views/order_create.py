from modules.carts.models import Cart
from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Order


class OrderCreateView(APIView):
    permission_classes = [IsUser]

    def post(self, request):
        user = request.user
        cart_ids = request.data.get("cart_ids", [])

        if not cart_ids:
            return Response(
                {"error": "Требуются ID корзин"}, status=status.HTTP_400_BAD_REQUEST
            )

        carts = Cart.objects.filter(id__in=cart_ids, user=user)
        if len(carts) != len(cart_ids):
            return Response(
                {"error": "Некоторые корзины не найдены"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from ..serializers import OrderSerializer

        created_orders = []
        sellers = {}
        for cart in carts:
            order = Order.objects.create(
                product=cart.product,
                quantity=cart.quantity,
            )
            created_orders.append(order)
            product = cart.product
            if (
                hasattr(product, "store")
                and product.store
                and hasattr(product.store, "seller")
            ):
                seller = product.store.seller
                if seller and seller.id:
                    if seller.id not in sellers:
                        sellers[int(seller.id)] = {
                            "seller": seller,
                            "orders": [],
                        }
                    sellers[seller.id]["orders"].append(order)
            cart.delete()

        from ..models import OrderGroup, OrderStatus

        order_group = OrderGroup.objects.create(
            user=user,
            status=OrderStatus.PROCESSING,
        )
        order_group.orders.add(*created_orders)
        order_group.save()

        serialized_orders = [OrderSerializer(o).data for o in created_orders]
        total_sum = sum(order["total_price"] for order in serialized_orders)

        from ..tasks import send_order_created_notification

        send_order_created_notification.delay(
            user_id=int(user.id),
            order_group_id=int(order_group.id),
            orders_data=serialized_orders,
            total_sum=float(total_sum),
        )

        for seller_id, data in sellers.items():
            seller = data["seller"]
            orders_for_seller = data["orders"]
            order_items = [
                {
                    "product_name": o.product.name,
                    "quantity": o.quantity,
                    "order_id": o.id,
                }
                for o in orders_for_seller
            ]
            buyer_name = (
                user.get_full_name() if hasattr(user, "get_full_name") else str(user)
            )
            buyer_phone = getattr(user, "phone", "")
            if hasattr(seller, "user") and seller.user:
                serialized_seller_orders = [
                    OrderSerializer(o).data for o in orders_for_seller
                ]
                seller_total_sum = sum(
                    order["total_price"] for order in serialized_seller_orders
                )

                from ..tasks import send_seller_new_order_notification

                send_seller_new_order_notification.delay(
                    seller_user_id=int(seller.user.id),
                    order_group_id=int(order_group.id),
                    orders_data=serialized_seller_orders,
                    order_items=order_items,
                    buyer_name=buyer_name,
                    buyer_phone=buyer_phone,
                    total_sum=float(seller_total_sum),
                )

        return Response(
            {"success": True, "order_group_id": order_group.id},
            status=status.HTTP_201_CREATED,
        )
