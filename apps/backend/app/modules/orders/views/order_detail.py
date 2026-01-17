from django.shortcuts import get_object_or_404
from modules.sellers.models import Seller
from modules.users.permissions import IsUserOrActiveSeller
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Order, OrderStatus
from ..serializers import OrderSerializer


class OrderDetailView(APIView):
    permission_classes = [IsUserOrActiveSeller]

    def get(self, request, id):
        order = get_object_or_404(
            Order.objects.select_related("user").prefetch_related(
                "sub_orders__seller", "sub_orders__product"
            ),
            id=id,
        )

        if request.user.role == "user":
            if order.user.id != request.user.id:
                return Response({"error": "Доступ запрещен"}, status=403)
        elif request.user.role == "seller":
            seller = Seller.objects.get(user=request.user)
            has_seller_items = any(
                item.seller.id == seller.id for item in order.sub_orders.all()
            )
            if not has_seller_items:
                return Response({"error": "Доступ запрещен"}, status=403)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
