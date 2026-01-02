import logging

from django.apps import apps
from django.conf import settings
from django.db import models

from .tasks import send_email_task, send_push_notification_task

logger = logging.getLogger(__name__)


def send_email_notification(recipient_email, subject, template_name, context=None):
    logger.info(
        f"Отправка email на {recipient_email}, тема: {subject}, шаблон: {template_name}"
    )
    try:
        task = send_email_task.delay(
            recipient_email=recipient_email,
            subject=subject,
            template_name=template_name,
            context=context,
        )
        logger.info(f"Email задача создана с ID: {task.id}")
        return task.id
    except Exception as e:
        logger.error(f"Ошибка при отправке email: {e}")
        return None


def send_notification(user, title, message, **kwargs):
    logger.info(f"Запуск send_notification: заголовок={title}, user={user}")
    link = kwargs.get("link")
    email_subject = kwargs.get("email_subject", title)
    email_template = kwargs.get("email_template")
    email_context = kwargs.get("email_context")
    notification_type = kwargs.get("notification_type", "")
    data = kwargs.get("data", {})
    tag = kwargs.get("tag")
    send_push = kwargs.get("send_push", False)

    logger.info(
        f"Параметры: email_subject={email_subject}, email_template={email_template}, notification_type={notification_type}, link={link}"
    )

    result = {"email": None, "push": None}

    from .models import NOTIFICATION_TYPES

    valid_types = [choice[0] for choice in NOTIFICATION_TYPES.choices]

    notification_data = dict(data) if data else {}
    if link:
        notification_data["link"] = link

    email_task_ids = []

    admin_users = []
    if user is None:
        User = apps.get_model(
            settings.AUTH_USER_MODEL.split(".")[0],
            settings.AUTH_USER_MODEL.split(".")[1],
        )
        admin_users = User.objects.filter(
            models.Q(is_superuser=True) | models.Q(role="admin")
        )
        logger.info(f"Найдено {admin_users.count()} администраторов для рассылки")

        for admin in admin_users:
            if hasattr(admin, "email") and admin.email:
                logger.info(f"Отправка уведомления администратору: {admin.email}")
                task_id = send_email_notification(
                    recipient_email=admin.email,
                    subject=email_subject,
                    template_name=email_template,
                    context=email_context,
                )
                if task_id:
                    email_task_ids.append(task_id)
                    logger.info(
                        f"Успешно создана задача email для {admin.email} с ID: {task_id}"
                    )
                else:
                    logger.error(f"Не удалось создать задачу email для {admin.email}")
    elif email_template and hasattr(user, "email"):
        email_task_ids.append(
            send_email_notification(
                recipient_email=user.email,
                subject=email_subject,
                template_name=email_template,
                context=email_context,
            )
        )

    result["email"] = email_task_ids if email_task_ids else None

    push_task_ids = []

    if notification_type in valid_types and send_push:
        if user is None:
            for admin in admin_users:
                push_task = send_push_notification_task.delay(
                    user_id=int(admin.id),
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    data=notification_data,
                    tag=tag or notification_type,
                    url=link,
                    save_notification=True,
                )
                push_task_ids.append(push_task.id)
        else:
            push_task = send_push_notification_task.delay(
                user_id=int(user.id),
                title=title,
                message=message,
                notification_type=notification_type,
                data=notification_data,
                tag=tag or notification_type,
                url=link,
                save_notification=True,
            )
            push_task_ids.append(push_task.id)

    result["push"] = push_task_ids if push_task_ids else None

    logger.info(
        f"Результат отправки уведомлений: email={result['email']}, push={result['push']}"
    )
    return result
