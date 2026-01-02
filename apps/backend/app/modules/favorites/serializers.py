from rest_framework import serializers
from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = [
            "id",
            "product",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_product(self, obj):
        images = obj.product.images.all()
        image_list = [{"id": img.id, "image": img.image.url} for img in images]

        product_data = {
            "id": obj.product.id,
            "name": obj.product.name,
            "slug": obj.product.slug,
            "price": obj.product.price,
            "discount": obj.product.discount,
            "images": image_list,
        }
        return product_data


class FavoriteCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = Favorite
        fields = ["product_id"]
        
    def validate_product_id(self, value):
        from modules.products.models import Product
        try:
            Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Продукт не найден")
        return value
        
    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        from modules.products.models import Product
        product = Product.objects.get(id=int(product_id))
        user = self.context['request'].user
        
        favorite = Favorite.objects.get_or_create(
            user=user,
            product=product
        )
        
        return favorite
