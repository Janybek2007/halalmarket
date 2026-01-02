import logging

from django.conf import settings
from django.core.management.base import BaseCommand
from modules.notifications.services.email_service import email_service

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Отправляет тестовое письмо для проверки EmailService"

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            default="code.by.500@gmail.com",
            help="Email-адрес получателя тестового письма (по умолчанию: code.by.500@gmail.com)",
        )

    def handle(self, *args, **options):
        email = options["email"]
        template_name = "test_email"

        self.stdout.write(
            f"Отправка тестового письма на {email} с шаблоном {template_name}..."
        )

        try:
            context = {
                "user_email": email,
                "date": "17.08.2025 03:24",
                "link": "/profile",
                "client_url": settings.CLIENT_URL,
            }

            success = email_service.send_email(
                to_email=email,
                subject="Тестовое письмо от Halal Market",
                template_name=template_name,
                context=context,
            )

            if success:
                self.stdout.write(
                    self.style.SUCCESS(f"Письмо успешно отправлено на {email}")
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"Ошибка при отправке письма на {email}")
                )
                logger.error(f"Ошибка при отправке тестового письма на {email}")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ошибка: {str(e)}"))
            logger.error(f"Ошибка в команде test_email: {str(e)}")
