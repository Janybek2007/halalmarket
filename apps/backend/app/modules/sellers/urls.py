from django.urls import path

from .views import (
    ProductCreateView,
    ProductDeleteView,
    ProductListView,
    ProductUpdateView,
    ReviewDeleteView,
    SellerOrderListView,
    SellerOrderShipView,
    SellerRequestView,
    SellerSetProfileView,
    SellerStoreCreateView,
    SellerStoreDetailView,
    StoreReviewResponseView,
    StoreReviewsListView,
)

urlpatterns = [
    path("store/create/", SellerStoreCreateView.as_view(), name="store-create"),
    path("store/", SellerStoreDetailView.as_view(), name="store-detail"),
    path("store/products/", ProductListView.as_view(), name="store-products"),
    path("store/product/create/", ProductCreateView.as_view(), name="product-create"),
    path("store/product/<int:id>/", ProductUpdateView.as_view(), name="product-update"),
    path(
        "store/product/<int:id>/delete/",
        ProductDeleteView.as_view(),
        name="product-delete",
    ),
    #
    path("seller/request/", SellerRequestView.as_view(), name="seller-register"),
    path(
        "seller/set-profile/", SellerSetProfileView.as_view(), name="seller-set-profile"
    ),
    # Seller endpoints
    path(
        "seller/orders/ship/", SellerOrderShipView.as_view(), name="seller-order-ship"
    ),
    path("seller/orders/", SellerOrderListView.as_view(), name="seller-order-list"),
    path("seller/reviews/", StoreReviewsListView.as_view(), name="seller-reviews-list"),
    path(
        "seller/reviews/<int:review_id>/respond/",
        StoreReviewResponseView.as_view(),
        name="seller-review-respond",
    ),
    path(
        "seller/reviews/<int:review_id>/delete/",
        ReviewDeleteView.as_view(),
        name="seller-review-delete",
    ),
]
