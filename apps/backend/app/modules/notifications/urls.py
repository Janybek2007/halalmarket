from django.urls import path

from .views import (
    NotificationDeleteView,
    NotificationListView,
    NotificationMarkReadView,
    PushSubscriptionCreateView,
)

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path(
        "notifications/mark-read/",
        NotificationMarkReadView.as_view(),
        name="notification-mark-read",
    ),
    path(
        "notification/delete/",
        NotificationDeleteView.as_view(),
        name="notification-delete",
    ),
    path(
        "notification/push-subscription/",
        PushSubscriptionCreateView.as_view(),
        name="push-subscription-create",
    ),
]
