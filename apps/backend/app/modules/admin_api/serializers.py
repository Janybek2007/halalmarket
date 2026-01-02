from rest_framework import serializers

from modules.users.models import Seller, User
from modules.categories.serializers import CategorySerializer
from modules.products.models import Product
from modules.products.serializers import ProductImageSerializer
from modules.sellers.models import Store
from shared.utils.calculate_average_rating import calculate_average_rating


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "email", "phone", "id", "avatar"]


class AdminStoreSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ["id", "name", "seller_name"]

    def get_seller_name(self, obj):
        if hasattr(obj, "seller") and obj.seller:
            return obj.seller.user.full_name
        return None


class AdminProductSerializer(serializers.ModelSerializer):
    subcategory = CategorySerializer(read_only=True)
    store = AdminStoreSerializer(read_only=True)
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
            "store",
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


class AdminSellerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    store = AdminStoreSerializer(read_only=True)

    class Meta:
        model = Seller
        fields = ["id", "user", "store", "status", "created_at", "updated_at"]
