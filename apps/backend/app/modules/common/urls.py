from django.urls import path

from .views import CategoriesListView, ProductsListView

urlpatterns = [
    path("products/slugs/", ProductsListView.as_view(), name="products-slugs"),
    path("categories/slugs/", CategoriesListView.as_view(), name="categories-slugs"),
]
