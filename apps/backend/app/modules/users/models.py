from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from shared.utils.phone_validator import validate_phone_format


class SellerStatus(models.TextChoices):
    ACTIVE = "active", "Активен"
    BLOCKED = "blocked", "Заблокирован"

    def __str__(self):
        return self.name.lower()


class UserRole(models.TextChoices):
    USER = "user", "Пользователь"
    SELLER = "seller", "Продавец"
    ADMIN = "admin", "Администратор"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Поле Email должно быть заполнено")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.ADMIN)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Суперпользователь должен иметь is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(
        max_length=15, validators=[validate_phone_format], verbose_name="Телефон"
    )
    avatar = models.FileField(
        upload_to="avatars/", null=True, blank=True, verbose_name="Аватар"
    )
    address = models.CharField(
        max_length=255, null=True, blank=True, verbose_name="Адрес"
    )
    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.USER,
        verbose_name="Роль",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "phone"]

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return self.email


class TokenType(models.TextChoices):
    REFRESH = "refresh", "Refresh"
    RESET_PASSWORD = "reset_password", "Reset Password"
    SELLER_SET_PROFILE = "seller_set_profile", "Seller Set Profile"


class Token(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tokens",
        verbose_name="Пользователь",
    )
    token_type = models.CharField(
        max_length=20,
        choices=TokenType.choices,
        verbose_name="Тип токена",
    )
    token = models.CharField(max_length=255, unique=True, verbose_name="Токен")
    expires_at = models.DateTimeField(verbose_name="Срок истечения")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Токен"
        verbose_name_plural = "Токены"

    def __str__(self):
        return f"{self.user.email} - {self.token_type}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at


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
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Продавец"
        verbose_name_plural = "Продавцы"

    def __str__(self):
        return f"{self.user.full_name} - {self.status}"
