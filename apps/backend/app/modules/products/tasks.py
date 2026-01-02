from config.celery import app
from django.apps import apps
from django.conf import settings
from modules.notifications.tasks import send_email_task, send_push_notification_task


@app.task(name="modules.products.tasks.send_new_review_notification")
def send_new_review_notification(
    seller_user_id,
    product_name,
    review_id,
    product_id,
    review_rating,
    review_text,
    user_email,
):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))
        email_context = {
            "product_name": product_name,
            "review_rating": review_rating,
            "review_text": review_text,
            "user_email": user_email,
            "seller_url": f"{settings.CLIENT_URL}/seller/reviews?_to={review_id}",
        }

        send_email_task.delay(
            recipient_email=seller_user.email,
            subject=f"Новый отзыв на продукт {product_name} на Halal Market",
            template_name="new_review",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(seller_user.id),
            title="Новый отзыв на продукт",
            message=f'Пользователь {user_email} оставил отзыв на продукт "{product_name}". Оценка: {review_rating}/5.',
            notification_type="new_review",
            data={
                "review_id": review_id,
                "product_id": product_id,
                "rating": review_rating,
            },
            tag="new_review",
            url=f"/seller/reviews?_to={review_id}",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}
