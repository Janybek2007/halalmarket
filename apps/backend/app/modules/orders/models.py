from django.db import models
from modules.products.models import Product
from modules.sellers.models import Seller
from modules.users.models import User


class OrderStatus(models.TextChoices):
    DELIVERED = "delivered", "Доставлен"
    PROCESSING = "processing", "В обработке"
    SHIPPED = "shipped", "В Пути"
    CANCELLED = "cancelled", "Отменен"


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "В ожидании"
    PAID = "paid", "Оплачено"
    FAILED = "failed", "Неудача"


class Order(models.Model):
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
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    delivery_date = models.DateTimeField(
        default=None, null=True, blank=True, verbose_name="Дата доставки"
    )
    delivery_address = models.TextField(
        blank=True, null=True, verbose_name="Адрес доставки"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        verbose_name="Статус платежа",
    )
    payment_method = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Метод оплаты"
    )
    transaction_id = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="ID транзакции"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Продукт",
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    seller = models.ForeignKey(
        Seller, on_delete=models.PROTECT, verbose_name="Продавец"
    )
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Элемент заказа"
        verbose_name_plural = "Элементы заказа"

    def __str__(self):
        return f"OrderItem {self.id}"

    @property
    def total_price(self):
        return self.price * self.quantity
