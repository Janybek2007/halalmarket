from modules.products.models import Review
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class ReviewDeleteView(SellerBaseView):
    permission_classes = [IsActiveSeller]

    def delete(self, request, review_id):
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
            review = Review.objects.get(id=int(review_id), product__seller=seller)
        except Review.DoesNotExist:
            return Response(
                {"error": "Отзыв не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        review.delete()
        return Response({"success": True})
