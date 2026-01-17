from django.conf import settings
from django.db import models
from django.utils import timezone


class SellerStatus(models.TextChoices):
    ACTIVE = "active", "Активен"
    BLOCKED = "blocked", "Заблокирован"

    def __str__(self):
        return self.name.lower()


class SellerInvite(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    token = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_seller_invites",
    )

    def mark_used(self):
        self.is_used = True
        self.save(update_fields=["is_used"])

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Invite for {self.phone} (used={self.is_used})"


class Seller(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller",
        verbose_name="Пользователь",
    )
    status = models.CharField(
        max_length=10,
        choices=SellerStatus.choices,
        default=SellerStatus.ACTIVE,
        verbose_name="Статус",
    )
    store_name = models.CharField(max_length=255, verbose_name="Название магазина")
    store_logo = models.FileField(
        upload_to="stores/logos/",
        null=True,
        blank=True,
        verbose_name="Логотип магазина",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Продавец"
        verbose_name_plural = "Продавцы"

    def __str__(self):
        return f"{self.user.full_name} - {self.status}"


class SellerBalance(models.Model):
    seller = models.OneToOneField(
        Seller,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="balance",
        verbose_name="Продавец",
    )
    available_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Доступный баланс",
    )
    hold_balance = models.DecimalField(
        max_digits=12, decimal_places=2, default=0, verbose_name="Удерживаемый баланс"
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Последнее обновление"
    )

    class Meta:
        verbose_name = "Баланс продавца"
        verbose_name_plural = "Балансы продавцов"

    def __str__(self):
        return f"Balance for {self.seller}: Available={self.available_balance}, Hold={self.hold_balance}"
