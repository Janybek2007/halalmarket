from django.urls import path

from .views import (
    OrderCheckoutView,
    OrderDetailView,
    OrderListView,
    OrderUpdateStatusView,
)

urlpatterns = [
    # Seller or User endpoints
    path("order/<int:id>/", OrderDetailView.as_view(), name="order-detail"),
    # User endpoints
    path("purchases/", OrderListView.as_view(), name="order-list"),
    path(
        "purchases/update-status/",
        OrderUpdateStatusView.as_view(),
        name="order-update-status",
    ),
    path("purchase/checkout/", OrderCheckoutView.as_view(), name="order-create"),
]
