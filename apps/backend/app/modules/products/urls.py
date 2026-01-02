from django.urls import path

from .views import (
    ProductDetailView,
    ProductListView,
    ProductReviewCreateView,
    ProductReviewListView,
)
from .views.product_search import ProductSearchView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/search/', ProductSearchView.as_view(), name='product-search'),
    path('product/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('product/<slug:slug>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    path('product/<slug:slug>/review/', ProductReviewCreateView.as_view(), name='product-review-create'),
]
