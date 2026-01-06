from django.db import models
from django.utils.translation import gettext_lazy as _
from modules.products.models import Product
from modules.sellers.models import Seller


class PromotionStatus(models.TextChoices):
    PENDING = "pending", _("Ожидает подтверждения")
    ACTIVE = "active", _("Активна")
    REJECTED = "rejected", _("Отклонена")


class Promotion(models.Model):
    """Модель акций и баннеров"""

    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    seller = models.ForeignKey(
        Seller, on_delete=models.CASCADE, related_name="promotions"
    )
    products = models.ManyToManyField(Product, related_name="promotions")
    discount = models.CharField(
        max_length=10, help_text=_("Скидка в формате MIN-MAX или конкретное число")
    )
    thumbnail = models.ImageField(
        upload_to="promotions/", help_text=_("Изображение для баннера")
    )
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text=_("Дата истечения акции")
    )
    is_expired = models.BooleanField(default=False, help_text=_("Истекла ли акция"))
    status = models.CharField(
        max_length=20, choices=PromotionStatus.choices, default=PromotionStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Акция")
        verbose_name_plural = _("Акции")
        ordering = ["-created_at"]

    def __str__(self):
        return f"Акция {self.id} от {self.seller.store_name if hasattr(self.seller, 'store_name') else self.seller.id}"
