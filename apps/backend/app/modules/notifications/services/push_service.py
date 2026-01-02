import json
import logging
from django.conf import settings
from pywebpush import webpush, WebPushException
from ..models import PushSubscription

VAPID_PRIVATE_KEY = settings.WEBPUSH_SETTINGS["VAPID_PRIVATE_KEY"]
VAPID_CLAIMS = {"sub": settings.WEBPUSH_SETTINGS["VAPID_ADMIN_EMAIL"]}

logger = logging.getLogger(__name__)


def send_web_push(user, title, message, data=None, tag=None, url=None):
    subscriptions = PushSubscription.objects.filter(user=user)
    if not subscriptions.exists():
        logger.warning(f"No subscriptions found for user {user}")
        return {"success": False, "error": "No subscriptions found"}

    payload = {
        "notification": {
            "title": title,
            "body": message,
            "tag": tag,
            "data": data or {},
            "url": url or getattr(settings, "CLIENT_URL", None),
        }
    }
    json_payload = json.dumps(payload)

    results = {"success": True, "sent": 0, "failed": 0, "errors": []}

    for subscription in subscriptions:
        subscription_info = {
            "endpoint": subscription.endpoint,
            "keys": {"p256dh": subscription.p256dh, "auth": subscription.auth},
        }
        try:
            webpush(
                subscription_info=subscription_info,
                data=json_payload,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS,
                ttl=86400,
            )
            results["sent"] += 1
            logger.info(
                f"Push sent successfully to {user} subscription {subscription.id}"
            )
        except WebPushException as e:
            results["failed"] += 1
            error_msg = (
                f"WebPushException for {user} subscription {subscription.id}: {str(e)}"
            )
            results["errors"].append(error_msg)
            logger.error(error_msg)
        except Exception as e:
            results["failed"] += 1
            error_msg = f"Exception for {user} subscription {subscription.id}: {str(e)}"
            results["errors"].append(error_msg)
            logger.exception(error_msg)

    if results["sent"] == 0 and results["failed"] > 0:
        results["success"] = False

    logger.info(
        f"Push summary for user {user}: sent={results['sent']}, failed={results['failed']}"
    )
    return results
