from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from modules.users.models import User
from rest_framework import serializers


class ForgotSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text="Email или номер телефона")
    password = serializers.CharField(write_only=True)

    def validate_identifier(self, value):
        from shared.utils.phone_validator import validate_phone_format

        try:
            validate_email(value)
            return value
        except ValidationError:
            pass

        try:
            return validate_phone_format(value)
        except ValidationError:
            raise serializers.ValidationError(
                "Укажите корректный email или номер телефона"
            )

    def validate(self, data):
        from django.core.exceptions import ValidationError
        from django.core.validators import validate_email

        identifier = data.get("identifier")
        password = data.get("password")

        try:
            validate_email(identifier)
            user = authenticate(email=identifier, password=password)
        except ValidationError:
            user = authenticate(phone=identifier, password=password)

        if not user:
            raise serializers.ValidationError(
                {"detail": "Неверный email/телефон или пароль"}
            )

        data["user"] = user
        return data


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "full_name", "phone"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            phone=validated_data["phone"],
        )
        return user


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Пароли не совпадают")
        return data
