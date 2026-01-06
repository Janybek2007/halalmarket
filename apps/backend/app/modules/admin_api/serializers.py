from modules.categories.serializers import CategorySerializer
from modules.products.models import Product
from modules.products.serializers import ProductImageSerializer
from modules.sellers.models import Seller
from modules.users.models import User
from rest_framework import serializers
from shared.utils.calculate_average_rating import calculate_average_rating


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["full_name", "email", "phone", "id", "avatar"]

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else None


class AdminSellerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    store_logo = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = [
            "id",
            "user",
            "store_name",
            "store_logo",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_store_logo(self, obj):
        return obj.store_logo.url if obj.store_logo else None


class AdminProductSerializer(serializers.ModelSerializer):
    subcategory = CategorySerializer(read_only=True)
    seller = AdminSellerSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    moderation_type = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "images",
            "price",
            "discount",
            "description",
            "seller",
            "slug",
            "subcategory",
            "country",
            "code",
            "composition",
            "expiration_date",
            "equipment",
            "action",
            "average_rating",
            "created_at",
            "moderation_type",
            "items_in_package",
        ]
        read_only_fields = ["id", "slug", "created_at"]

    def get_average_rating(self, obj):
        ratings = [review.rating for review in obj.reviews.all()]
        return calculate_average_rating(ratings)

    def get_moderation_type(self, obj):
        return str(obj.moderation_type) if obj.moderation_type else None
