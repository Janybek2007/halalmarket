from modules.users.models import Token, TokenType
from rest_framework import serializers

from .models import Seller


class SellerSerializer(serializers.ModelSerializer):
    store_logo = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = ["id", "store_name", "store_logo", "created_at", "user"]
        read_only_fields = ["id", "created_at", "user"]

    def get_store_logo(self, obj):
        return obj.store_logo.url if obj.store_logo else None


class SellerUpdateSerializer(serializers.ModelSerializer):
    store_logo = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = ["store_name", "store_logo"]

    def get_store_logo(self, obj):
        return obj.store_logo.url if obj.store_logo else None


class SellerSetProfileSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    profile_fullname = serializers.CharField(required=False, allow_blank=True)
    profile_email = serializers.EmailField(required=False, allow_blank=True)

    def validate_profile_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Поле phone не может быть пустым")
        return value

    def validate_profile_fullname(self, value):
        if value is not None and not value.strip():
            raise serializers.ValidationError("Поле full_name не может быть пустым")
        return value

    def validate_profile_email(self, value):
        if value is not None and not value.strip():
            raise serializers.ValidationError("Поле email не может быть пустым")
        return value

    def validate(self, attrs):
        token_value = attrs.get("token")

        try:
            invite = SellerInvite.objects.get(token=token_value, is_used=False)
        except SellerInvite.DoesNotExist:
            raise serializers.ValidationError(
                {"invite": "Неверная или использованная ссылка"}
            )

        if invite.is_expired():
            raise serializers.ValidationError({"invite": "Срок действия ссылки истёк"})

        try:
            token = Token.objects.get(
                token=token_value, token_type=TokenType.SELLER_SET_PROFILE
            )
        except Token.DoesNotExist:
            raise serializers.ValidationError({"token": "Неверный токен"})

        if token.is_expired:
            raise serializers.ValidationError({"token": "Токен истёк"})

        self.context["token_instance"] = token
        self.context["invite_instance"] = invite
        return attrs
