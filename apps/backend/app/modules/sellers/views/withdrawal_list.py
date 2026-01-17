from modules.payment.models import Withdrawal
from rest_framework.response import Response

from .base import SellerBaseView


class WithdrawalListView(SellerBaseView):
    """Список запросов на вывод средств продавца"""

    def get(self, request):
        seller = self.get_seller(request.user)
        if not seller:
            return Response({"error": "Профиль продавца не найден"}, status=403)

        withdrawals = Withdrawal.objects.filter(seller=seller).order_by("-created_at")

        data = [
            {
                "id": w.id,
                "amount": str(w.amount),
                "status": w.status,
                "status_display": w.get_status_display(),
                "created_at": w.created_at.isoformat(),
                "updated_at": w.updated_at.isoformat(),
            }
            for w in withdrawals
        ]

        return Response(data)
