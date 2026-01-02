from rest_framework import serializers

from .models import Cart


class CartSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "user", "product", "quantity", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

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
