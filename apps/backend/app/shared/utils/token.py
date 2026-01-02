import uuid
import jwt
from django.conf import settings
from django.utils import timezone
from modules.users.models import Token, TokenType
from rest_framework import exceptions


def validate_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Токен истек")
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed("Недействительный токен")


def generate_jwt_token(user, token_type="access"):
    if token_type == "access":
        lifetime = settings.ACCESS_TOKEN_LIFETIME
    elif token_type == "refresh":
        lifetime = settings.REFRESH_TOKEN_LIFETIME
    else:
        raise ValueError("Неверный тип токена")

    payload = {
        "user_id": user.id,
        "role": user.role,
        "exp": timezone.now() + lifetime,
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def generate_and_store_tokens(user):
    access_token = generate_jwt_token(user, token_type="access")
    refresh_token = str(uuid.uuid4())

    Token.objects.create(
        user=user,
        token_type=TokenType.REFRESH,
        token=refresh_token,
        expires_at=timezone.now() + settings.REFRESH_TOKEN_LIFETIME,
    )

    return access_token, refresh_token


def refresh_access_token(refresh_token):
    try:
        token_obj = Token.objects.get(token=refresh_token, token_type=TokenType.REFRESH)
        if token_obj.is_expired:
            token_obj.delete()
            raise ValueError("Токен истек")

        user = token_obj.user
        access_token = generate_jwt_token(user, token_type="access")

        return user, access_token

    except Token.DoesNotExist:
        raise ValueError("Неверный токен")


def generate_seller_set_profile_token(user):
    from datetime import timedelta

    token = str(uuid.uuid4())
    Token.objects.create(
        user=user,
        token_type=TokenType.SELLER_SET_PROFILE,
        token=token,
        expires_at=timezone.now() + timedelta(days=3),
    )
    return token
