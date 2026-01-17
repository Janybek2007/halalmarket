from decimal import Decimal

from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from modules.payment.models import Transaction, TransactionType
from modules.sellers.models import SellerBalance


class SellerBalanceService:
    @staticmethod
    @transaction.atomic
    def add_to_hold(seller, amount: Decimal, order_item):
        """Добавить средства в hold при создании заказа"""
        balance, _ = SellerBalance.objects.get_or_create(seller=seller)
        balance.hold_balance += amount
        balance.save()

        Transaction.objects.create(
            seller=seller,
            amount=amount,
            transaction_type=TransactionType.HOLD,
            content_type=ContentType.objects.get_for_model(order_item),
            object_id=order_item.id,
        )

    @staticmethod
    @transaction.atomic
    def release_from_hold(seller, amount: Decimal, order_item):
        """Перевести средства из hold в available при DELIVERED"""
        balance = SellerBalance.objects.select_for_update().get(seller=seller)
        balance.hold_balance -= amount
        balance.available_balance += amount
        balance.save()

        Transaction.objects.create(
            seller=seller,
            amount=amount,
            transaction_type=TransactionType.RELEASE,
            content_type=ContentType.objects.get_for_model(order_item),
            object_id=order_item.id,
        )

    @staticmethod
    @transaction.atomic
    def refund_from_hold(seller, amount: Decimal, order_item):
        """Списать средства с hold при CANCELLED/возврате"""
        balance = SellerBalance.objects.select_for_update().get(seller=seller)
        balance.hold_balance -= amount
        balance.save()

        Transaction.objects.create(
            seller=seller,
            amount=amount,
            transaction_type=TransactionType.REFUND,
            content_type=ContentType.objects.get_for_model(order_item),
            object_id=order_item.id,
        )
