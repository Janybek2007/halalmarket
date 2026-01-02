from django.shortcuts import get_object_or_404
from modules.users.permissions import IsUserOrActiveSeller
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import OrderGroup
from ..serializers import OrderGroupSerializer


class OrderDetailView(APIView):
    permission_classes = [IsUserOrActiveSeller]

    def get(self, _, id):
        order_group = get_object_or_404(OrderGroup, id=id)
        serializer = OrderGroupSerializer(order_group)
        return Response(serializer.data)
