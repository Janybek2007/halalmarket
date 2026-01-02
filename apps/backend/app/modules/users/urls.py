from django.urls import path

from .views import ChangePasswordView, UploadAvatarView, UserProfileView

urlpatterns = [
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),
    path(
        "user/change-password/",
        ChangePasswordView.as_view(),
        name="user-change-password",
    ),
    path(
        "user/upload-avatar/",
        UploadAvatarView.as_view(),
        name="user-upload-avatar",
    ),
]
