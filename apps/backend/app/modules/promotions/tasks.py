from config.celery import app
from django.apps import apps
from django.conf import settings
from modules.notifications.tasks import send_email_task, send_push_notification_task

from .models import Promotion


@app.task(name="modules.promotions.tasks.mark_promotion_expired")
def mark_promotion_expired(promotion_id):
    try:
        promotion = Promotion.objects.get(id=int(promotion_id))
        promotion.is_expired = True
        promotion.save(update_fields=["is_expired"])

        return f"Акция {promotion_id} отмечена как истекшая"
    except Promotion.DoesNotExist:
        return f"Акция {promotion_id} не найдена"
    except Exception as e:
        return f"Ошибка при обработке акции {promotion_id}: {str(e)}"


def schedule_promotion_expiration(promotion):
    if promotion.expires_at:
        mark_promotion_expired.apply_async(
            args=[int(promotion.id)], eta=promotion.expires_at
        )
        return True
    return False


@app.task(name="modules.promotions.tasks.send_promotion_request_notification")
def send_promotion_request_notification(
    promotion_id, seller_name, discount, products_count
):
    from django.db import models

    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        promotion = Promotion.objects.get(id=int(promotion_id))
        admin_users = User.objects.filter(
            models.Q(is_superuser=True) | models.Q(role="admin")
        )

        email_context = {
            "promotion": {
                "id": promotion.id,
                "discount": discount,
                "expires_at": promotion.expires_at,
                "products_count": products_count,
            },
            "seller": {"name": seller_name},
            "client_url": settings.CLIENT_URL,
        }

        products_text = (
            f"{products_count} продуктов" if products_count != 1 else "продукт"
        )
        message = f"Продавец {seller_name} создал заявку на акцию для {products_text} со скидкой {discount}%"

        for admin in admin_users:
            if hasattr(admin, "email") and admin.email:
                send_email_task.delay(
                    recipient_email=admin.email,
                    subject="Новая заявка на акцию на Halal Market",
                    template_name="promotion_request",
                    context=email_context,
                )

        for admin in admin_users:
            send_push_notification_task.delay(
                user_id=int(admin.id),
                title="Новая заявка на акцию",
                message=message,
                notification_type="new_promotion_request",
                data={"promotion_id": promotion.id},
                tag="promotion_request",
                url=f"/admin/promotions?_to={promotion.id}",
            )

        return {"success": True, "admins_notified": admin_users.count()}
    except Promotion.DoesNotExist:
        return {
            "success": False,
            "error": f"Promotion with id {promotion_id} not found",
        }


@app.task(name="modules.promotions.tasks.send_promotion_status_notification")
def send_promotion_status_notification(seller_user_id, action, promotions_data):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))

        status_messages = {
            "approve": {
                "title": "Заявки на акции одобрены",
                "message": f"Ваши заявки на акции ({len(promotions_data)} шт.) были одобрены администратором",
                "subject": "Заявки на акции одобрены - Halal Market",
                "template": "promotion_approved",
            },
            "reject": {
                "title": "Заявки на акции отклонены",
                "message": f"Ваши заявки на акции ({len(promotions_data)} шт.) были отклонены администратором",
                "subject": "Заявки на акции отклонены - Halal Market",
                "template": "promotion_rejected",
            },
        }

        status_info = status_messages.get(action, status_messages["approve"])
        email_context = {
            "promotions": promotions_data,
            "total_promotions": len(promotions_data),
            "action": action,
        }

        send_email_task.delay(
            recipient_email=seller_user.email,
            subject=status_info["subject"],
            template_name=status_info["template"],
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(seller_user.id),
            title=status_info["title"],
            message=status_info["message"],
            notification_type=f"promotion_{action}d",
            data={"total_promotions": len(promotions_data), "action": action},
            tag="promotion_status",
            url="/seller/promotions",
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}
