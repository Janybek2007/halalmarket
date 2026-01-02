from django.urls import path

from .views import (
    PromotionDeleteView,
    PromotionRequestUpdateStatusView,
    PromotionRequestView,
    PromotionsBannersView,
    PromotionsListView,
)

urlpatterns = [
    # Public endpoints
    path('promotions/banners/', PromotionsBannersView.as_view(), name='promotions-banners'),
    
    # Admin and Seller endpoints
    path('promotions/', PromotionsListView.as_view(), name='promotion-request'),
    
    # Seller endpoints
    path('promotion/request/', PromotionRequestView.as_view(), name='promotion-request'),
    path('promotion/<int:id>/delete/', PromotionDeleteView.as_view(), name='promotion-delete'),
    
    # Admin endpoints
    path('promotions/update-status/', PromotionRequestUpdateStatusView.as_view(), name='promotion-update-status'),
]
