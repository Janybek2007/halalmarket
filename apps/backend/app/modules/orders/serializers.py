from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "total_price", "seller"]
        read_only_fields = ["id", "price", "total_price"]

    def get_product(self, obj):
        product = obj.product
        images = [
            {"id": img.id, "image": img.image.url} for img in product.images.all()
        ]
        return {
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "price": product.price,
            "discount": product.discount or 0,
            "images": images,
        }

    def get_total_price(self, obj):
        return obj.price * obj.quantity


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "created_at",
            "delivery_date",
            "delivery_address",
            "items",
            "total_price",
            "payment_status",
            "payment_method",
            "transaction_id",
        ]
        read_only_fields = ["id", "created_at", "total_price"]

    def get_user(self, obj):
        user = obj.user
        return {
            "id": user.id,
            "full_name": getattr(user, "full_name", str(user)),
            "phone": getattr(user, "phone", None),
            "email": getattr(user, "email", None),
        }

    def get_total_price(self, obj):
        return sum(item.total_price for item in obj.items.all())
