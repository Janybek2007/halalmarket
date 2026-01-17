from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from modules.products.models import Product
from modules.sellers.models import Seller
from modules.users.models import User


class TransactionType(models.TextChoices):
    DEPOSIT = "deposit", "Пополнение (Продажа)"
    WITHDRAWAL = "withdrawal", "Вывод средств"
    HOLD = "hold", "Заморозка (Hold)"
    RELEASE = "release", "Разморозка (Списание с hold)"
    REFUND = "refund", "Возврат"


class WithdrawalStatus(models.TextChoices):
    REQUESTED = "requested", "Запрошен"
    APPROVED = "approved", "Одобрен"
    REJECTED = "rejected", "Отклонен"
    COMPLETED = "completed", "Выполнен"
    FAILED = "failed", "Неудача"


class Transaction(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    seller = models.ForeignKey(
        Seller,
        on_delete=models.PROTECT,
        related_name="transactions",
        verbose_name="Продавец",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Сумма")
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        verbose_name="Тип транзакции",
    )
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    source_object = GenericForeignKey("content_type", "object_id")

    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Время транзакции")

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Транзакция"
        verbose_name_plural = "Транзакции"

    def __str__(self):
        return f"{self.get_transaction_type_display()} of {self.amount} for {self.seller} at {self.timestamp}"


class Withdrawal(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    seller = models.ForeignKey(
        Seller,
        on_delete=models.CASCADE,
        related_name="withdrawals",
        verbose_name="Продавец",
    )
    amount = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Сумма вывода"
    )
    status = models.CharField(
        max_length=20,
        choices=WithdrawalStatus.choices,
        default=WithdrawalStatus.REQUESTED,
        verbose_name="Статус вывода",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата запроса")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Запрос на вывод средств"
        verbose_name_plural = "Запросы на вывод средств"

    def __str__(self):
        return f"Withdrawal request of {self.amount} for {self.seller} ({self.get_status_display()})"
