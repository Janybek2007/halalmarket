from django.db import models
from modules.products.models import Product
from modules.users.models import User


class Cart(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="carts",
        verbose_name="Пользователь",
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="carts", verbose_name="Продукт"
    )
    quantity = models.IntegerField(default=1, verbose_name="Количество")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
        unique_together = ["user", "product"]

    def __str__(self):
        return f"Корзина пользователя {self.user.full_name} - {self.product.name}"
