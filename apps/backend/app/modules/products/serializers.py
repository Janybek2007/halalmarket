from modules.categories.serializers import CategorySerializer
from modules.favorites.models import Favorite
from modules.sellers.serializers import StoreSerializer
from modules.users.models import User
from rest_framework import serializers
from shared.utils.calculate_average_rating import calculate_average_rating

from .models import Product, ProductImage, Review, ReviewImage


class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "avatar"]


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True, source="review_images")
    image_files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=True),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "product",
            "rating",
            "comment",
            "seller_response",
            "images",
            "image_files",
            "created_at",
        ]
        read_only_fields = ["id", "product", "created_at"]

    def create(self, validated_data):
        image_files = validated_data.pop("image_files", [])
        review = super().create(validated_data)

        for image in image_files:
            ReviewImage.objects.create(review=review, image=image)

        return review


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image"]
        read_only_fields = ["id"]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, required=False
    )
    moderation_type = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()
    images_files = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "images",
            "images_files",
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
            "is_favorite",
            "equipment",
            "action",
            "average_rating",
            "created_at",
            "moderation_type",
            "items_in_package",
        ]
        read_only_fields = ["id", "slug", "created_at", "store"]

    def _get_moderation_status(self, status):
        if not status:
            return None
        status_mapping = {
            "approved": "одобрен",
            "rejected": "отклонен",
            "pending": "на модерации",
        }
        return status_mapping.get(status, str(status))

    def get_is_favorite(self, obj):
        request = self.context.get("request")

        if not request:
            return False
        if not hasattr(request, "user"):
            return False

        user = request.user
        if user.is_anonymous:
            return False

        return Favorite.objects.filter(product=obj, user=user).exists()

    def get_average_rating(self, obj):
        ratings = [review.rating for review in obj.reviews.all()]
        return calculate_average_rating(ratings)

    def get_moderation_type(self, obj):
        return self._get_moderation_status(obj.moderation_type) if obj else None

    def create(self, validated_data):
        images_files = validated_data.pop("images_files", [])
        seller = self.context.get("seller")

        if seller and hasattr(seller, "store"):
            validated_data["store"] = seller.store

        product = super().create(validated_data)

        for image in images_files:
            ProductImage.objects.create(product=product, image=image)

        return product


class ProductDetailSerializer(serializers.ModelSerializer):
    subcategory = CategorySerializer(read_only=True)
    store = StoreSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    moderation_type = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=True),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "images",
            "image_files",
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

    def _get_moderation_status(self, status):
        if not status:
            return None
        status_mapping = {
            "approved": "одобрен",
            "rejected": "отклонен",
            "pending": "на модерации",
        }
        return status_mapping.get(status, str(status))

    def get_average_rating(self, obj):
        ratings = [review.rating for review in obj.reviews.all()]
        return calculate_average_rating(ratings)

    def get_moderation_type(self, obj):
        return self._get_moderation_status(obj.moderation_type) if obj else None


class ProductSearchSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "images", "slug", "price", "discount"]
        read_only_fields = ["id", "slug"]

    def get_images(self, obj):
        first_image = obj.images.first()
        return first_image.image.url if first_image and first_image.image else None
