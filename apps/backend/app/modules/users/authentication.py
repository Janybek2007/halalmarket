from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework import authentication, exceptions
from shared.utils.token import validate_jwt_token


class EmailPhoneModelBackend(ModelBackend):
    def authenticate(self, request=None, email=None, phone=None, password=None):
        UserModel = get_user_model()

        try:
            if email:
                user = UserModel.objects.get(email=email)
                if user.check_password(password):
                    return user
            elif phone:
                users = UserModel.objects.filter(phone=phone)
                for user in users:
                    if user.check_password(password):
                        return user
            return None
        except UserModel.DoesNotExist:
            return None


class TokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        access_token = auth_header.split(" ")[1]

        payload = validate_jwt_token(access_token)
        user_id = payload.get("user_id")
        role = payload.get("role")

        if not user_id:
            raise exceptions.AuthenticationFailed("Неверный токен")

        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(id=int(user_id))
        except UserModel.DoesNotExist:
            raise exceptions.AuthenticationFailed("Пользователь не найден")

        return user, None
