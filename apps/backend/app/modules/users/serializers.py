from modules.sellers.models import Seller
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()

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
            "seller",
        ]
        read_only_fields = ["id", "role", "created_at"]

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else None

    def get_seller(self, obj):
        try:
            seller = Seller.objects.get(user=obj)
            return {
                "id": seller.id,
                "status": seller.status,
                "store_name": seller.store_name,
                "store_logo": seller.store_logo.url if seller.store_logo else None,
            }
        except Seller.DoesNotExist:
            return None


class SellerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Seller
        fields = ["id", "user", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
