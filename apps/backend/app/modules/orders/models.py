from django.db import models
from modules.products.models import Product
from modules.users.models import User


class OrderStatus(models.TextChoices):
    DELIVERED = "delivered", "Доставлен"
    PROCESSING = "processing", "В обработке"
    SHIPPED = "shipped", "В Пути"
    CANCELLED = "cancelled", "Отменен"


class Order(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Продукт",
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Order {self.id} - {self.product.name} x {self.quantity}"


class OrderGroup(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="order_groups",
        verbose_name="Пользователь",
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PROCESSING,
        verbose_name="Статус",
    )
    orders = models.ManyToManyField(
        Order,
        related_name="groups",
        verbose_name="Заказы в группе",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    delivery_date = models.DateTimeField(
        default=None, null=True, blank=True, verbose_name="Дата доставки"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Группа заказов"
        verbose_name_plural = "Группы заказов"

    def __str__(self):
        return f"OrderGroup {self.id} - {self.user.full_name} - {self.status}"
