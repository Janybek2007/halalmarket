from decimal import Decimal
from enum import Enum

from django.db import models
from modules.categories.models import Category
from modules.sellers.models import Store
from modules.users.models import User
from rest_framework.fields import MaxValueValidator, MinValueValidator
from shared.utils.to_slug import toSlug


class ModerationType(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Product(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    name = models.CharField(max_length=610, verbose_name="Название")
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Цена"
    )
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00"), verbose_name="Скидка"
    )
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="products",
        verbose_name="Магазин",
    )
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL-ссылка")
    subcategory = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products",
        verbose_name="Категория",
    )
    country = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Страна"
    )
    moderation_type = models.CharField(
        max_length=255,
        choices=[(tag.value, tag.value) for tag in ModerationType],
        default=ModerationType.PENDING.value,
        verbose_name="Тип модерации",
    )
    items_in_package = models.IntegerField(
        blank=True, null=True, verbose_name="Количество продуктов"
    )
    code = models.CharField(max_length=255, blank=True, null=True, verbose_name="Код")
    composition = models.TextField(blank=True, null=True, verbose_name="Состав")
    expiration_date = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Срок годности"
    )
    equipment = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Комплектация"
    )
    action = models.TextField(blank=True, null=True, verbose_name="Действие")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        base_slug = toSlug(self.name)
        slug = base_slug
        counter = 1
        while Product.objects.filter(slug=slug).exclude(id=self.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        self.slug = slug
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Продукт",
    )
    image = models.FileField(upload_to="products/images/", verbose_name="Изображение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Изображение продукта"
        verbose_name_plural = "Изображения продуктов"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Изображение {self.id} для продукта {self.product.name}"


class Review(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Пользователь",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Продукт",
    )
    rating = models.IntegerField(
        verbose_name="Оценка",
        validators=[
            MinValueValidator(1, "Рейтинг должен быть не менее 1"),
            MaxValueValidator(5, "Рейтинг должен быть не более 5"),
        ],
    )
    comment = models.TextField(verbose_name="Комментарий")
    seller_response = models.TextField(
        null=True, blank=True, verbose_name="Ответ продавца"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ["-created_at"]
        # unique_together = ["user", "product"]
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

    def __str__(self):
        return f"{self.user.full_name} - {self.product.name} - {self.rating}"

    def delete(self, *args, **kwargs):
        self.review_images.all().delete()
        super().delete(*args, **kwargs)


class ReviewImage(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name="review_images",
        verbose_name="Отзыв",
    )
    image = models.FileField(upload_to="reviews/images/", verbose_name="Изображение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Изображение отзыва"
        verbose_name_plural = "Изображения отзывов"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Изображение {self.id} для отзыва {self.review.id}"
