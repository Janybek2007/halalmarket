from django.http import HttpResponse
from django.urls import path


def health_check(request):
    """
    Простая проверка здоровья приложения.
    Возвращает строку "ok", если приложение работает.
    """
    return HttpResponse("ok", content_type="text/plain")


urlpatterns = [
    path("api/health/", health_check, name="health_check"),
]
