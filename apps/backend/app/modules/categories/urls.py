from django.urls import path

from .views import (
    CategoryCreateView,
    CategoryDeleteView,
    CategoryListView,
    CategoryUpdateView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    # Admin urls
    path(
        "categories/create/",
        CategoryCreateView.as_view(),
        name="category-create",
    ),
    path(
        "categories/<slug:slug>/update/",
        CategoryUpdateView.as_view(),
        name="category-update",
    ),
    path(
        "categories/<slug:slug>/delete/",
        CategoryDeleteView.as_view(),
        name="category-delete",
    ),
]
