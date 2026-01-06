from django.db import models

from modules.users.models import User


class Notification(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Пользователь",
    )
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    message = models.TextField(verbose_name="Сообщение")
    notification_type = models.CharField(
        max_length=30,
        verbose_name="Тип уведомления",
    )
    is_read = models.BooleanField(default=False, verbose_name="Прочитано")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    data = models.JSONField(null=True, blank=True, verbose_name="Дополнительные данные")

    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.user.email}"


class PushSubscription(models.Model):
    """
    Модель для хранения подписок на push-уведомления
    """

    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="push_subscriptions",
        verbose_name="Пользователь",
    )
    endpoint = models.TextField(verbose_name="Endpoint")
    p256dh = models.TextField(verbose_name="P256DH ключ")
    auth = models.TextField(verbose_name="Auth ключ")
    browser = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Браузер"
    )
    device = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Устройство"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Push-подписка"
        verbose_name_plural = "Push-подписки"
        unique_together = ("user", "endpoint")

    def __str__(self):
        return f"Push-подписка {self.user.email}"
