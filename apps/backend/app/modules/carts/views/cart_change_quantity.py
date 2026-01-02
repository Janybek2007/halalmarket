from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Cart


class CartChangeQuantityView(APIView):
    permission_classes = [IsUser]
    schema = None

    def patch(self, request, id):
        quantity = request.data.get("quantity")

        if not id:
            return Response(
                {"error": "Требуется ID элемента корзины"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity is None:
            return Response(
                {"error": "Требуется количество"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = Cart.objects.get(user=request.user, id=id)
        except Cart.DoesNotExist:
            return Response(
                {"error": "Элемент корзины не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            new_quantity = int(quantity)
            if new_quantity < 0:
                return Response(
                    {"error": "Количество не может быть отрицательным"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart.quantity = new_quantity
            if new_quantity == 0:
                cart.delete()
                return Response({"success": True})

            cart.save()
            return Response({"success": True})
        except ValueError:
            return Response(
                {"error": "Неверное значение количества"},
                status=status.HTTP_400_BAD_REQUEST,
            )
