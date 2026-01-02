from config.celery import app
from django.apps import apps
from django.conf import settings

from .services.email_service import EmailService
from .services.push_service import send_web_push

email_service = EmailService()


@app.task(name="modules.notifications.tasks.send_email_task")
def send_email_task(recipient_email, subject, template_name, context=None):
    try:
        return email_service.send_email(
            to_email=recipient_email,
            subject=subject,
            template_name=template_name,
            context=context,
        )
    except Exception as e:
        return str(e)


@app.task(name="modules.notifications.tasks.send_push_notification_task")
def send_push_notification_task(
    user_id,
    title,
    message,
    notification_type="system",
    data=None,
    tag=None,
    url=None,
    save_notification=True,
):
    try:
        User = apps.get_model(
            settings.AUTH_USER_MODEL.split(".")[0],
            settings.AUTH_USER_MODEL.split(".")[1],
        )
        Notification = apps.get_model("notifications", "Notification")

        user = User.objects.get(id=int(user_id))

        if save_notification:
            Notification.objects.create(
                user=user,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data,
            )

        result = send_web_push(
            user=user, title=title, message=message, data=data, tag=tag, url=url
        )

        return result
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}
