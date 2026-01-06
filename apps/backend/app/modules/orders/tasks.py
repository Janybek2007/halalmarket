from config.celery import app
from django.apps import apps
from django.conf import settings
from modules.notifications.tasks import send_email_task, send_push_notification_task


@app.task(name="modules.orders.tasks.send_order_created_notification")
def send_order_created_notification(user_id, order_id, orders_data, total_sum):
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split(".")[0], settings.AUTH_USER_MODEL.split(".")[1]
    )

    try:
        user = User.objects.get(id=int(user_id))
        order_data = orders_data[0] if orders_data else {}

        email_context = {
            "order_id": order_id,
            "items": order_data.get("items", []),
            "total_price": total_sum,
            "client_url": settings.CLIENT_URL,
        }

        send_email_task.delay(
            recipient_email=user.email,
            subject="Заказ успешно создан - Halal Market",
            template_name="order_created",
            context=email_context,
        )

        send_push_notification_task.delay(
            user_id=int(user.id),
            title="Заказ успешно создан",
            message=f"Ваш заказ на сумму {total_sum} сом успешно оформлен",
            notification_type="order_created",
            data={"order_id": int(order_id), "total_sum": str(total_sum)},
            tag="order_created",
            url="/profile/my_purchases",
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}


@app.task(name="modules.orders.tasks.send_seller_new_order_notification")
def send_seller_new_order_notification(
    seller_user_id,
    order_id,
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
        order_data = orders_data[0] if orders_data else {}

        email_context = {
            "order_id": int(order_id),
            "order_items": order_items,
            "buyer_name": buyer_name,
            "buyer_phone": buyer_phone,
            "total_sum": total_sum,
            "client_url": settings.CLIENT_URL,
            "delivery_address": order_data.get("delivery_address"),
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
                "order_id": int(order_id),
                "total_sum": str(total_sum),
                "buyer_name": buyer_name,
            },
            tag="seller_orders",
            url=f"/seller/orders?_to={int(order_id)}",
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
                "message": f"Заказы отменены {total_orders} заказ(ов)",
                "subject": "Заказы отменены - Halal Market",
                "template": "order_cancelled",
            },
        }

        status_info = status_messages.get(status_value, status_messages["delivered"])

        # Обрабатываем данные для шаблона
        processed_orders = []
        for order_data in orders_data:
            processed_order = {
                "id": order_data.get("id"),
                "items": order_data.get("items", []),
                "user": order_data.get("user", {}),
            }
            processed_orders.append(processed_order)

        email_context = {
            "orders": processed_orders,
            "total_orders": total_orders,
            "status": status_value,
            "client_url": settings.CLIENT_URL,
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
            tag=f"order_{status_value}",
            url="/profile/my_purchases",
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
                "template": "orders_delivered",
            },
            "cancelled": {
                "title": "Заказы отменены",
                "message": f"Заказы отменены {total_orders} заказ(ов)",
                "subject": f"Заказы отменены - {store_name}",
                "template": "orders_cancelled",
            },
        }

        status_info = status_messages.get(status_value, status_messages["delivered"])

        processed_orders = []
        for order_data in orders_data:
            processed_order = {
                "id": order_data.get("id"),
                "items": order_data.get("items", []),
                "user": order_data.get("user", {}),
            }
            processed_orders.append(processed_order)

        email_context = {
            "store_name": store_name,
            "orders": processed_orders,
            "total_orders": total_orders,
            "status": status_value,
            "client_url": settings.CLIENT_URL,
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

        # Обрабатываем данные для шаблона
        processed_orders = []
        for order_data in orders_data:
            processed_order = {
                "id": order_data.get("id"),
                "items": order_data.get("items", []),
                "tracking_number": order_data.get("tracking_number"),
                "tracking_url": order_data.get("tracking_url"),
            }
            processed_orders.append(processed_order)

        email_context = {
            "store_name": store_name,
            "orders": processed_orders,
            "total_orders": total_orders,
            "client_url": settings.CLIENT_URL,
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
        )

        return {"success": True}
    except User.DoesNotExist:
        return {"success": False, "error": f"User with id {user_id} not found"}
