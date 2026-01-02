from django.urls import path
from .views.favorite_list import FavoriteListView
from .views.favorite_toggle import FavoriteToggleView

urlpatterns = [
    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
    path("favorites/toggle/", FavoriteToggleView.as_view(), name="favorite-toggle"),
]
