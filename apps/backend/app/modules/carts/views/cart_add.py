from modules.products.models import Product
from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Cart


class CartAddView(APIView):
    permission_classes = [IsUser]
    schema = None

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response(
                {"error": "Требуется ID продукта"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Продукт не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        cart, created = Cart.objects.get_or_create(
            user=request.user, product=product, defaults={"quantity": quantity}
        )
        if not created:
            cart.quantity += quantity
            cart.save()

        return Response({"success": True})
