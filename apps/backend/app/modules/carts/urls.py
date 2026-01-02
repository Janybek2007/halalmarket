from django.urls import path

from .views import CartAddView, CartChangeQuantityView, CartListView, CartRemoveView

urlpatterns = [
    path("cart/", CartListView.as_view(), name="cart-list"),
    path("cart/add/", CartAddView.as_view(), name="cart-add"),
    path("cart/<int:id>/", CartRemoveView.as_view(), name="cart-remove"),
    path(
        "cart/<int:id>/change-quantity/",
        CartChangeQuantityView.as_view(),
        name="cart-change-quantity",
    ),
]
