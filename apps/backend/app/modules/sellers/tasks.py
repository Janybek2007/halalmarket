from config.celery import app
from django.apps import apps
from django.conf import settings
from django.utils import timezone
from modules.notifications.tasks import send_email_task, send_push_notification_task

from .models import SellerInvite


@app.task(name="modules.sellers.tasks.delete_expired_seller_invites")
def delete_expired_seller_invites():
    """Удаление истекших приглашений продавцов"""
    now = timezone.now()
    deleted_count = SellerInvite.objects.filter(expires_at__lt=now).delete()[0]
    return f"Удалено {deleted_count} истекших приглашений"


@app.task(name="modules.sellers.tasks.send_product_notification_task")
def send_product_notification_task(product_id, seller_name):
    try:
        from django.db import models

        User = apps.get_model(
            settings.AUTH_USER_MODEL.split(".")[0],
            settings.AUTH_USER_MODEL.split(".")[1],
        )
        Product = apps.get_model("products", "Product")

        product = Product.objects.get(id=int(product_id))
        admin_users = User.objects.filter(
            models.Q(is_superuser=True) | models.Q(role="admin")
        )

        email_context = {
            "product": {
                "name": product.name,
                "store": product.seller.store_name,
                "seller": seller_name,
            },
            "admin_url": f"{settings.CLIENT_URL}/admin/products?_to={product.id}",
        }

        for admin in admin_users:
            if hasattr(admin, "email") and admin.email:
                send_email_task.delay(
                    recipient_email=admin.email,
                    subject="Новый продукт ожидает модерации",
                    template_name="product_created",
                    context=email_context,
                )

        for admin in admin_users:
            send_push_notification_task.delay(
                user_id=int(admin.id),
                title="Новый продукт ожидает модерации",
                message=f'Продавец {seller_name} добавил новый продукт "{product.name}" для модерации',
                notification_type="new_product",
                data={
                    "product_id": product.id,
                    "product_name": product.name,
                    "seller_name": seller_name,
                },
                tag="new_product",
                url=f"/admin/products?_to={product.id}",
            )

        return {"success": True, "admins_notified": admin_users.count()}
    except Product.DoesNotExist:
        return {"success": False, "error": f"Product with id {product_id} not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.task(name="modules.sellers.tasks.send_seller_invite_notification")
def send_seller_invite_notification(user_id, invite_url, seller_name, seller_phone):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        email_context = {
            "seller_name": seller_name,
            "seller_phone": seller_phone,
            "invite_url": invite_url,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject="Приглашение на Halal Market",
            template_name="seller_invite",
            context=email_context,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.sellers.tasks.send_seller_request_notification")
def send_seller_request_notification(phone):
    from django.db import models

    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    admin_users = User.objects.filter(
        models.Q(is_superuser=True) | models.Q(role="admin")
    )

    message_text = f"Поступила заявка от номера: {phone}"

    for admin in admin_users:
        if hasattr(admin, "email") and admin.email:
            send_email_task.delay(
                recipient_email=admin.email,
                subject="Заявка на регистрацию продавца",
                template_name="seller_request",
                context={"phone": phone},
            )

    for admin in admin_users:
        send_push_notification_task.delay(
            user_id=int(admin.id),
            title="Новая заявка продавца",
            message=message_text,
            notification_type="new_seller_request",
            data={"phone": phone},
            tag="seller_request",
            url="/admin/sellers",
        )

    return {"success": True, "admins_notified": admin_users.count()}
