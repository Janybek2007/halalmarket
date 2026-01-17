from django.db import transaction
from modules.payment.models import Withdrawal, WithdrawalStatus
from modules.sellers.models import SellerBalance
from rest_framework import status
from rest_framework.response import Response

from .base import SellerBaseView


class WithdrawalCreateView(SellerBaseView):
    """Создание запроса на вывод средств"""

    @transaction.atomic
    def post(self, request):
        seller = self.get_seller(request.user)
        if not seller:
            return Response({"error": "Профиль продавца не найден"}, status=403)

        amount = request.data.get("amount")
        if not amount:
            return Response(
                {"error": "Сумма не указана"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from decimal import Decimal

            amount = Decimal(str(amount))
            if amount <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return Response(
                {"error": "Некорректная сумма"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            balance = SellerBalance.objects.select_for_update().get(seller=seller)
        except SellerBalance.DoesNotExist:
            return Response(
                {"error": "Баланс не найден"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if balance.available_balance < amount:
            return Response(
                {"error": "Недостаточно средств для вывода"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Создаем запрос на вывод
        withdrawal = Withdrawal.objects.create(
            seller=seller,
            amount=amount,
            status=WithdrawalStatus.REQUESTED,
        )

        # Блокируем сумму (вычитаем из available)
        balance.available_balance -= amount
        balance.save()

        return Response(
            {
                "success": True,
                "withdrawal_id": withdrawal.id,
                "message": "Запрос на вывод создан",
            },
            status=status.HTTP_201_CREATED,
        )
