from config.celery import app
from django.conf import settings
from django.utils import timezone
from modules.notifications.tasks import send_email_task

from ..users.models import Token


@app.task(name="modules.auth.tasks.delete_expired_tokens")
def delete_expired_tokens():
    Token.objects.filter(expires_at__lt=timezone.now()).delete()


@app.task(name="modules.auth.tasks.send_password_reset_notification")
def send_password_reset_notification(user_id, reset_token):
    from django.apps import apps

    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        reset_url = f"{settings.CLIENT_URL}/auth/reset-password?token={reset_token}"
        email_context = {"reset_url": reset_url}

        send_email_task.delay(
            recipient_email=user.email,
            subject="Сброс пароля на Halal Market",
            template_name="password_reset",
            context=email_context,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.auth.tasks.send_welcome_notification")
def send_welcome_notification(user_id, user_email, created_at):
    from django.apps import apps

    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        profile_url = f"{settings.CLIENT_URL}/profile"
        email_context = {
            "profile_url": profile_url,
            "user_email": user_email,
            "date": created_at,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject="Добро пожаловать на Halal Market",
            template_name="welcome",
            context=email_context,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}
