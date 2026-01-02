from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path("api/", include("modules.users.urls")),
    path("api/", include("modules.auth.urls")),
    path("api/", include("modules.categories.urls")),
    path("api/", include("modules.products.urls")),
    path("api/", include("modules.carts.urls")),
    path("api/", include("modules.orders.urls")),
    path("api/", include("modules.sellers.urls")),
    path("api/", include("modules.admin_api.urls")),
    path("api/", include("modules.notifications.urls")),
    path("api/", include("modules.favorites.urls")),
    path("api/", include("modules.promotions.urls")),
    path("api/", include("modules.common.urls")),
]

if settings.__ENV["MODE"] == "local":
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
