from django.apps import apps
from django.conf import settings

from config.celery import app
from modules.notifications.tasks import send_email_task, send_push_notification_task


@app.task(name="modules.admin_api.tasks.send_product_deleted_notification")
def send_product_deleted_notification(seller_user_id, product_name, product_slug):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))
        email_context = {
            "product": {"name": product_name, "slug": product_slug},
            "client_url": settings.CLIENT_URL,
        }

        send_email_task.delay(
            recipient_email=seller_user.email,
            subject=f"Ваш продукт {product_name} был удален на Halal Market",
            template_name="product_deleted",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(seller_user.id),
            title=f"Ваш продукт {product_name} был удален",
            message=f'Ваш продукт "{product_name}" был удален администратором.',
            notification_type="product_deleted",
            data={"product_name": product_name},
            tag="product_deleted",
            url="/seller/products",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}


@app.task(name="modules.admin_api.tasks.send_product_moderation_notification")
def send_product_moderation_notification(
    seller_user_id, product_name, product_slug, status_value, status_text, moderation_notes=""
):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))
        email_context = {
            "product": {
                "name": product_name,
                "slug": product_slug,
                "moderation_notes": moderation_notes,
            },
            "status": status_text,
            "client_url": settings.CLIENT_URL,
        }

        status_messages = {
            "approved": "Поздравляем! Ваш продукт одобрен и теперь доступен для покупателей.",
            "rejected": "Пожалуйста, внесите необходимые изменения и отправьте продукт на повторную проверку.",
            "pending": "Ваш продукт находится на модерации.",
        }

        message = f'Ваш продукт "{product_name}" был {status_text} администратором. {status_messages.get(status_value, "")}'

        send_email_task.delay(
            recipient_email=seller_user.email,
            subject=f"Модерация продукта {product_name} на Halal Market",
            template_name="product_moderation_result",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(seller_user.id),
            title=f"Модерация продукта {product_name}",
            message=message,
            notification_type="product_moderate",
            data={
                "product_name": product_name,
                "status": status_value,
            },
            tag="product_moderate",
            url=f"/seller/products?_to={product_slug}",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}


@app.task(name="modules.admin_api.tasks.send_seller_deleted_notification")
def send_seller_deleted_notification(user_id, user_email):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        email_context = {"client_url": settings.CLIENT_URL}

        send_email_task.delay(
            recipient_email=user_email,
            subject="Ваш аккаунт был удален на Halal Market",
            template_name="seller_account_deleted",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(user.id),
            title="Ваш аккаунт был удален",
            message="Ваш аккаунт на Halal Market был удален администратором магазина.",
            notification_type="seller_deleted",
            data={},
            tag="seller_deleted",
            url="/",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.admin_api.tasks.send_seller_status_notification")
def send_seller_status_notification(user_id, status_value):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))

        if status_value == "active":
            send_email_task.delay(
                recipient_email=user.email,
                subject="Аккаунт активен",
                template_name="emails/seller_active.html",
                context={},
            )

            send_push_notification_task.delay(
                user_id=int(user.id),
                title="Аккаунт активен",
                message="Ваш аккаунт продавца активен и готов к работе",
                notification_type="seller_active",
                data={},
                tag="seller_status",
                url="/seller/dashboard",
                save_notification=True,
            )
        elif status_value == "blocked":
            send_email_task.delay(
                recipient_email=user.email,
                subject="Аккаунт заблокирован",
                template_name="emails/seller_blocked.html",
                context={},
            )

            send_push_notification_task.delay(
                user_id=int(user.id),
                title="Аккаунт заблокирован",
                message="Ваш аккаунт продавца был заблокирован администратором",
                notification_type="seller_blocked",
                data={},
                tag="seller_status",
                url="/seller/dashboard",
                save_notification=True,
            )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}
