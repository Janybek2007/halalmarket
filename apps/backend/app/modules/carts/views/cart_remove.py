from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Cart


class CartRemoveView(APIView):
    permission_classes = [IsUser]
    schema = None

    def delete(self, request, id):
        try:
            cart = Cart.objects.get(user=request.user, id=id)
            cart.delete()
            return Response({"success": True})
        except Cart.DoesNotExist:
            return Response(
                {"error": "Продукт не найден в корзине"},
                status=status.HTTP_404_NOT_FOUND,
            )
