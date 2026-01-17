from decimal import Decimal

from django.db import transaction
from modules.carts.models import Cart
from modules.sellers.services import SellerBalanceService
from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Order, OrderItem


class OrderCheckoutView(APIView):
    permission_classes = [IsUser]

    @transaction.atomic
    def post(self, request):
        user = request.user
        cart_ids = request.data.get("cart_ids", [])

        if not cart_ids:
            return Response(
                {"error": "Требуются ID корзин"}, status=status.HTTP_400_BAD_REQUEST
            )

        carts = Cart.objects.filter(id__in=cart_ids, user=user).select_related(
            "product", "product__seller"
        )
        if len(carts) != len(cart_ids):
            return Response(
                {"error": "Некоторые корзины не найдены"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from ..serializers import OrderSerializer

        order = Order.objects.create(
            user=user,
            delivery_address=request.data.get("delivery_address", ""),
            payment_method=request.data.get("payment_method", ""),
            total_amount=Decimal("0.00"),
        )

        created_order_items = []
        sellers = {}
        total_amount = Decimal("0.00")

        for cart in carts:
            item_total = cart.product.price * cart.quantity

            order_item = OrderItem.objects.create(
                order=order,
                product=cart.product,
                quantity=cart.quantity,
                seller=cart.product.seller,
                price=cart.product.price,
                total_amount=item_total,
            )
            created_order_items.append(order_item)
            total_amount += item_total

            # Зачисление на hold баланс продавца
            SellerBalanceService.add_to_hold(
                seller=cart.product.seller,
                amount=item_total,
                order_item=order_item,
            )

            seller = cart.product.seller
            if seller and seller.id:
                if seller.id not in sellers:
                    sellers[int(seller.id)] = {
                        "seller": seller,
                        "store_name": (
                            seller.store_name
                            if hasattr(seller, "store_name")
                            else "Магазин"
                        ),
                        "order_items": [],
                    }
                sellers[seller.id]["order_items"].append(order_item)
            cart.delete()

        # Обновляем общую сумму заказа
        order.total_amount = total_amount
        order.save()

        # Сериализуем заказ для уведомлений
        serialized_order = OrderSerializer(order).data
        total_sum = serialized_order["total_price"]

        from ..tasks import send_order_created_notification

        send_order_created_notification.delay(
            user_id=int(user.id),
            order_id=int(order.id),
            orders_data=[serialized_order],
            total_sum=float(total_sum),
        )

        # Отправляем уведомления продавцам
        for seller_id, data in sellers.items():
            seller = data["seller"]
            order_items_for_seller = data["order_items"]

            order_items_data = [
                {
                    "product": {
                        "name": item.product.name,
                        "discount": item.product.discount or 0,
                    },
                    "quantity": item.quantity,
                    "price": str(item.price),
                    "total_price": str(item.total_price),
                }
                for item in order_items_for_seller
            ]

            buyer_name = (
                user.get_full_name() if hasattr(user, "get_full_name") else str(user)
            )
            buyer_phone = getattr(user, "phone", "")

            if hasattr(seller, "user") and seller.user:
                seller_total_sum = sum(
                    item.total_price for item in order_items_for_seller
                )

                from ..tasks import send_seller_new_order_notification

                send_seller_new_order_notification.delay(
                    seller_user_id=int(seller.user.id),
                    order_id=int(order.id),
                    orders_data=[serialized_order],
                    order_items=order_items_data,
                    buyer_name=buyer_name,
                    buyer_phone=buyer_phone,
                    total_sum=float(seller_total_sum),
                )

        return Response(
            {"success": True, "order_id": order.id},
            status=status.HTTP_201_CREATED,
        )
