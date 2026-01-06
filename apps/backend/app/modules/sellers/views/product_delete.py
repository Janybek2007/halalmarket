from modules.products.models import Product
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class ProductDeleteView(SellerBaseView):
    permission_classes = [IsActiveSeller]

    def delete(self, request, id):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            product = Product.objects.get(id=id, seller=seller)
        except Product.DoesNotExist:
            return Response(
                {"error": "Продукт не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        product.delete()
        return Response({"success": True})
