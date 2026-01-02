import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.client_url = settings.CLIENT_URL

    def send_email(self, to_email, subject, template_name, context=None):
        if context is None:
            context = {}

        context["client_url"] = self.client_url

        try:
            html_content = render_to_string(f"emails/{template_name}.html", context)

            send_mail(
                subject=subject,
                message="",
                from_email=self.from_email,
                recipient_list=[to_email],
                html_message=html_content,
                fail_silently=False,
            )

            logger.info(f"Email успешно отправлен на {to_email} с темой '{subject}'")
            return True

        except Exception as e:
            logger.error(f"Ошибка отправки email на {to_email}: {str(e)}")
            return False


email_service = EmailService()
