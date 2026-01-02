from django.conf import settings
from django.db import models
from django.utils import timezone
from modules.users.models import Seller


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


class Store(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    name = models.CharField(max_length=255, verbose_name="Название")
    seller = models.OneToOneField(
        Seller,
        on_delete=models.CASCADE,
        related_name="store",
        verbose_name="Продавец",
        null=True,
        blank=True,
    )
    logo = models.FileField(
        upload_to="stores/logos/", null=True, blank=True, verbose_name="Логотип"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Магазин"
        verbose_name_plural = "Магазины"

    def __str__(self):
        return self.name
