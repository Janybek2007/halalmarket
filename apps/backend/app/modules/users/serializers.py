from rest_framework import serializers

from .models import Seller, User
from modules.sellers.models import Store


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "avatar",
            "address",
            "role",
            "created_at",
        ]
        read_only_fields = ["id", "role", "created_at"]


class SellerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Seller
        fields = ["id", "user", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class StoreSerializer(serializers.ModelSerializer):
    logo = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Store
        fields = ["id", "name", "logo", "created_at"]
        read_only_fields = ["id", "created_at"]
