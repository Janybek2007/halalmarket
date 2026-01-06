from modules.sellers.models import Seller, SellerStatus
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class SellerBaseView(APIView):
    permission_classes = [IsActiveSeller]

    def get_seller(self, user):
        """Get seller instance for the given user"""
        try:
            return Seller.objects.get(user=user)
        except Seller.DoesNotExist:
            return None

    def validate_seller_role(self, user):
        """Validate if user is a seller"""
        if user.role != "seller":
            return Response(
                {"error": "Пользователь не является продавцом"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    def validate_seller_status(self, seller):
        """Validate seller status"""
        if seller.status != SellerStatus.ACTIVE:
            return Response(
                {"error": "Аккаунт продавца не активен"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None
