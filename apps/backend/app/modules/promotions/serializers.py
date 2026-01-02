from django.apps import apps
from modules.products.models import Product
from modules.users.models import Seller
from rest_framework import serializers

from .models import Promotion
from .tasks import schedule_promotion_expiration


class ProductLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "images", "slug", "price", "discount"]


class SellerLimitedSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = ["id", "status", "user"]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "full_name": obj.user.full_name,
            "avatar": obj.user.avatar.url if obj.user.avatar else None,
            "email": obj.user.email,
            "phone": obj.user.phone,
        }


class PromotionSerializer(serializers.ModelSerializer):
    """Полный сериализатор для модели Promotion"""

    seller = SellerLimitedSerializer(read_only=True)
    products = ProductLimitedSerializer(many=True, read_only=True)

    class Meta:
        model = Promotion
        fields = [
            "id",
            "seller",
            "products",
            "discount",
            "thumbnail",
            "expires_at",
            "is_expired",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "status"]


class PromotionCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания акций"""

    products = serializers.CharField(
        write_only=True,
        help_text="Список ID продуктов через запятую (например: '1,2,3')",
    )
    expires_at = serializers.DateTimeField(
        required=True,
        help_text="Дата и время окончания акции в формате ISO 8601 (YYYY-MM-DDThh:mm:ss)",
    )

    class Meta:
        model = Promotion
        fields = ["products", "discount", "thumbnail", "expires_at"]

    def create(self, validated_data):
        products_str = validated_data.pop("products")
        product_ids = [
            int(pid.strip()) for pid in products_str.split(",") if pid.strip()
        ]

        seller = self.context["request"].user.seller
        promotion = Promotion.objects.create(seller=seller, **validated_data)

        # добавляем продукты
        for product_id in product_ids:
            promotion.products.add(product_id)

        if promotion.expires_at:
            schedule_promotion_expiration(promotion)

        return promotion


class PromotionUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления акций"""

    class Meta:
        model = Promotion
        fields = ["discount", "thumbnail", "expires_at"]

    def update(self, instance, validated_data):
        old_expires_at = instance.expires_at
        instance = super().update(instance, validated_data)

        if "expires_at" in validated_data and instance.expires_at != old_expires_at:
            if instance.expires_at:
                if instance.is_expired:
                    instance.is_expired = False
                    instance.save(update_fields=["is_expired"])

                schedule_promotion_expiration(instance)

        return instance


class PromotionListSerializer(PromotionSerializer):
    products = ProductLimitedSerializer(many=True, read_only=True)
    seller = SellerLimitedSerializer(read_only=True)

    class Meta:
        model = Promotion
        fields = [
            "id",
            "products",
            "seller",
            "discount",
            "thumbnail",
            "expires_at",
            "is_expired",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "status"]
