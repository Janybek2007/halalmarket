from django.db import models
from modules.products.models import Product
from modules.users.models import User


class Favorite(models.Model):
    """
    Модель для хранения избранных товаров пользователя
    """

    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="favorites",
        verbose_name="Продукт",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites",
        verbose_name="Пользователь",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранное"
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
