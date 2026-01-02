from django.urls import path

from .views import (
    AdminProductDeleteView,
    AdminProductListView,
    AdminProductModerateView,
    AdminSellerInviteView,
    AdminSellerListView,
    AdminSellersDeleteView,
    AdminSellersUpdateStatusView,
)

urlpatterns = [
    path("products-list/", AdminProductListView.as_view(), name="admin-product-list"),
    path(
        "products/<int:id>/moderate/",
        AdminProductModerateView.as_view(),
        name="admin-product-moderate",
    ),
    path(
        "products/<int:id>/delete/",
        AdminProductDeleteView.as_view(),
        name="admin-product-delete",
    ),
    # sellers
    path(
        "sellers/invite/",
        AdminSellerInviteView.as_view(),
        name="admin-seller-invite",
    ),
    path("sellers-list/", AdminSellerListView.as_view(), name="admin-seller-list"),
    path(
        "sellers/update-status/",
        AdminSellersUpdateStatusView.as_view(),
        name="admin-sellers-update-status",
    ),
    path(
        "sellers/delete/",
        AdminSellersDeleteView.as_view(),
        name="admin-seller-delete",
    ),
]
