from modules.sellers.models import SellerBalance
from rest_framework.response import Response

from .base import SellerBaseView


class SellerBalanceView(SellerBaseView):
    """Получение баланса продавца"""

    def get(self, request):
        seller = self.get_seller(request.user)
        if not seller:
            return Response({"error": "Профиль продавца не найден"}, status=403)

        try:
            balance = SellerBalance.objects.get(seller=seller)
        except SellerBalance.DoesNotExist:
            balance = SellerBalance.objects.create(seller=seller)

        return Response(
            {
                "available_balance": str(balance.available_balance),
                "hold_balance": str(balance.hold_balance),
                "total_balance": str(balance.available_balance + balance.hold_balance),
            }
        )
