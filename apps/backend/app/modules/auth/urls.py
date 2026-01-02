from django.urls import path

from .views import (
    ForgotView,
    LoginView,
    LogoutView,
    RefreshView,
    RegisterView,
    ResetPasswordView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/forgot/", ForgotView.as_view(), name="auth-forgot"),
    path(
        "auth/reset-password/", ResetPasswordView.as_view(), name="auth-reset-password"
    ),
]
