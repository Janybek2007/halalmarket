from config.celery import app
from django.apps import apps
from django.conf import settings
from modules.notifications.tasks import send_email_task, send_push_notification_task


@app.task(name="modules.orders.tasks.send_order_created_notification")
def send_order_created_notification(user_id, order_group_id, orders_data, total_sum):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        email_context = {
            "order_group": order_group_id,
            "orders": orders_data,
            "total_sum": total_sum,
            "client_url": settings.CLIENT_URL,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject="Заказ(ы) успешно создан(ы) - Halal Market",
            template_name="order_created",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(user.id),
            title="Заказ(ы) успешно создан(ы)",
            message=f"Ваш заказ на сумму {total_sum} сом успешно оформлен",
            notification_type="order_created",
            data={"order_group_id": int(order_group_id), "total_sum": str(total_sum)},
            tag="order_created",
            url="/profile/my_purchases",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.orders.tasks.send_seller_new_order_notification")
def send_seller_new_order_notification(
    seller_user_id,
    order_group_id,
    orders_data,
    order_items,
    buyer_name,
    buyer_phone,
    total_sum,
):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))
        email_context = {
            "order_group": int(order_group_id),
            "orders": orders_data,
            "order_items": order_items,
            "buyer_name": buyer_name,
            "buyer_phone": buyer_phone,
            "total_sum": total_sum,
            "client_url": settings.CLIENT_URL,
        }

        send_email_task.delay(
            recipient_email=seller_user.email,
            subject="Новый заказ на Halal Market",
            template_name="order_new",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(seller_user.id),
            title="Новый заказ",
            message="Поступил новый заказ на ваши товары.",
            notification_type="new_order",
            data={
                "order_group_id": int(order_group_id),
                "total_sum": str(total_sum),
                "buyer_name": buyer_name,
            },
            tag="seller_orders",
            url=f"/seller/orders?_to={int(order_group_id)}",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}


@app.task(name="modules.orders.tasks.send_order_status_notification")
def send_order_status_notification(user_id, status_value, orders_data, total_orders):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))

        status_messages = {
            "delivered": {
                "title": "Заказы доставлены",
                "message": f"Вы подтвердили получение {total_orders} заказ(ов)",
                "subject": "Заказы доставлены - Halal Market",
                "template": "order_delivered",
            },
            "cancelled": {
                "title": "Заказы отменены",
                "message": f"Вы отменили {total_orders} заказ(ов)",
                "subject": "Заказы отменены - Halal Market",
                "template": "order_cancelled",
            },
        }

        status_info = status_messages.get(status_value, status_messages["delivered"])
        email_context = {
            "orders": orders_data,
            "total_orders": total_orders,
            "status": status_value,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject=status_info["subject"],
            template_name=status_info["template"],
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(user.id),
            title=status_info["title"],
            message=status_info["message"],
            notification_type=f"order_{status_value}",
            data={"total_orders": total_orders, "status": status_value},
            tag="order_status",
            url="/profile/my_purchases",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.orders.tasks.send_seller_order_status_notification")
def send_seller_order_status_notification(
    seller_user_id, store_name, status_value, orders_data, total_orders
):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        seller_user = User.objects.get(id=int(seller_user_id))

        status_messages = {
            "delivered": {
                "title": "Заказы доставлены",
                "message": f"Покупатель подтвердил получение {total_orders} заказ(ов)",
                "subject": f"Заказы доставлены - {store_name}",
                "template": "seller_order_delivered",
            },
            "cancelled": {
                "title": "Заказы отменены",
                "message": f"Покупатель отменил {total_orders} заказ(ов)",
                "subject": f"Заказы отменены - {store_name}",
                "template": "seller_order_cancelled",
            },
        }

        status_info = status_messages.get(status_value, status_messages["delivered"])
        email_context = {
            "store_name": store_name,
            "orders": orders_data,
            "total_orders": total_orders,
            "status": status_value,
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
            notification_type=f"seller_order_{status_value}",
            data={
                "store_name": store_name,
                "total_orders": total_orders,
                "status": status_value,
            },
            tag="seller_order_status",
            url="/seller/orders",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {seller_user_id} not found"}


@app.task(name="modules.orders.tasks.send_orders_shipped_notification")
def send_orders_shipped_notification(user_id, store_name, orders_data, total_orders):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        email_context = {
            "store_name": store_name,
            "orders": orders_data,
            "total_orders": total_orders,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject=f"Ваши заказы отправлены от {store_name} - Halal Market",
            template_name="orders_shipped",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(user.id),
            title="Заказы отправлены",
            message=f"Продавец {store_name} отправил {total_orders} заказ(ов)",
            notification_type="orders_shipped",
            data={"store_name": store_name, "total_orders": total_orders},
            tag="orders_shipped",
            url="/profile/my_purchases",
            save_notification=True,
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}
