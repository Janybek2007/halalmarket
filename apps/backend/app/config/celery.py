import os

from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from celery import Celery

app = Celery("halal_market")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks(
    lambda: [
        "modules.notifications",
        "modules.analytics",
        "modules.products",
        "modules.accounts",
        "modules.sellers",
        "modules.admin_api",
        "modules.orders",
        "modules.promotions",
    ]
)

app.conf.beat_schedule = {
    "delete-expired-tokens": {
        "task": "modules.auth.tasks.delete_expired_tokens",
        "schedule": crontab(minute=0, hour=0, day_of_month=1),
        "args": (),
    },
    "delete-expired-seller-invites": {
        "task": "modules.sellers.tasks.delete_expired_seller_invites",
        "schedule": crontab(minute=0, hour=0, day_of_month=1),
        "args": (),
    },
}


@app.task(bind=True, name="config.debug_task")
def debug_task(self):
    print(f"Request: {self.request!r}")
