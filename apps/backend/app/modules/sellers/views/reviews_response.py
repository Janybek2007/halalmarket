from modules.users.permissions import IsActiveSeller
from modules.products.models import Review
from ..models import Store
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class StoreReviewResponseView(SellerBaseView):
    permission_classes = [IsActiveSeller]

    def post(self, request, review_id):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        review = get_object_or_404(Review, id=int(review_id))

        if not Store.objects.filter(seller=seller, products=review.product).exists():
            return Response(
                {"error": "У вас нет прав для ответа на этот отзыв"},
                status=status.HTTP_403_FORBIDDEN,
            )

        response_text = request.data.get("response")
        if not response_text:
            return Response(
                {"error": "Требуется текст ответа"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        review.seller_response = response_text
        review.save()

        return Response({"success": True})
