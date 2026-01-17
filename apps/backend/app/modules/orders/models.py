from django.db import models
from modules.products.models import Product
from modules.sellers.models import Seller
from modules.users.models import User


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Ожидание подтверждения"
    SHIPPED = "shipped", "Отправлен"
    DELIVERED = "delivered", "Доставлен"
    CANCELLED = "cancelled", "Отменен"
    CANCELLATION_REQUESTED = "cancellation_requested", "Запрошена отмена"


class OrderItemStatus(models.TextChoices):
    PROCESSING = "processing", "В обработке"
    SHIPPED = "shipped", "Отправлен"
    DELIVERED = "delivered", "Доставлен"
    CANCELLED = "cancelled", "Отменен"
    RETURN_REQUESTED = "return_requested", "Запрошен возврат"
    RETURNED = "returned", "Возвращен"


class Order(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders",
        verbose_name="Пользователь",
    )
    status = models.CharField(
        max_length=25,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        verbose_name="Общий статус заказа",
    )
    delivery_address = models.TextField(verbose_name="Адрес доставки")
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Итоговая сумма"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    payment_method = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Метод оплаты"
    )
    payment_gateway_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        verbose_name="ID транзакции в шлюзе",
    )
    delivery_date = models.DateTimeField(
        null=True, blank=True, verbose_name="Дата доставки"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Основной заказ"
        verbose_name_plural = "Основные заказы"

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="sub_orders",
        verbose_name="Основной заказ",
    )
    seller = models.ForeignKey(
        Seller,
        on_delete=models.PROTECT,
        related_name="sub_orders",
        verbose_name="Продавец",
    )
    status = models.CharField(
        max_length=20,
        choices=OrderItemStatus.choices,
        default=OrderItemStatus.PROCESSING,
        verbose_name="Статус под-заказа",
    )
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Сумма для продавца"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name="order_items",
        verbose_name="Продукт",
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Цена за единицу"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    delivery_date = models.DateTimeField(
        default=None, null=True, blank=True, verbose_name="Дата доставки"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Элемент заказа (по продавцу)"
        verbose_name_plural = "Элементы заказа (по продавцам)"

    def __str__(self):
        return f"OrderItem {self.id} for seller {self.seller.id}"

    @property
    def total_price(self):
        return self.price * self.quantity
