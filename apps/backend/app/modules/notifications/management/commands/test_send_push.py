from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db.models import Q
from modules.notifications.services.push_service import send_web_push


class Command(BaseCommand):
    help = "Отправка тестового push-уведомления всем администраторам"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS("=== Тестовая отправка Push всем администраторам ===")
        )

        User = get_user_model()

        admin_users = User.objects.filter(Q(is_superuser=True) | Q(role="admin"))
        if not admin_users.exists():
            self.stdout.write(self.style.ERROR("Нет администраторов для отправки."))
            return

        self.stdout.write(f"Найдено администраторов: {admin_users.count()}")
        for user in admin_users:
            self.stdout.write(f"Отправка уведомления пользователю: {user}")
            result = send_web_push(
                user=user,
                title="Новое уведомление (Server)",
                message="У вас есть новые уведомления (Server)",
                data={"test": "test"},
                url="/auth/login",
            )
            self.stdout.write(f"Результат: {result}")

        self.stdout.write(self.style.SUCCESS("Отправка завершена."))
