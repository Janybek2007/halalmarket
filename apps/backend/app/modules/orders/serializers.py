from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "total_price", "seller", "status"]
        read_only_fields = ["id", "price", "total_price", "status"]

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
    items = OrderItemSerializer(source="sub_orders", many=True, read_only=True)
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
            "payment_method",
            "payment_gateway_id",
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
        return sum(item.total_price for item in obj.sub_orders.all())


class SellerOrderSerializer(serializers.ModelSerializer):
    """
    Serializer для продавца - показывает только его OrderItems.
    Передайте seller_id через context: {'seller_id': seller.id}
    """

    items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    item_status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "item_status",
            "created_at",
            "delivery_date",
            "delivery_address",
            "items",
            "total_price",
        ]
        read_only_fields = ["id", "created_at", "total_price"]

    def get_items(self, obj):
        seller_id = self.context.get("seller_id")
        if seller_id:
            items = obj.sub_orders.filter(seller_id=seller_id)
        else:
            items = obj.sub_orders.all()
        return OrderItemSerializer(items, many=True).data

    def get_total_price(self, obj):
        seller_id = self.context.get("seller_id")
        if seller_id:
            items = obj.sub_orders.filter(seller_id=seller_id)
        else:
            items = obj.sub_orders.all()
        return sum(item.total_price for item in items)

    def get_item_status(self, obj):
        """Статус товаров этого продавца в заказе"""
        seller_id = self.context.get("seller_id")
        if seller_id:
            items = obj.sub_orders.filter(seller_id=seller_id)
            statuses = set(items.values_list("status", flat=True))
            if len(statuses) == 1:
                return list(statuses)[0]
            return "mixed"
        return obj.status

    def get_user(self, obj):
        user = obj.user
        return {
            "id": user.id,
            "full_name": getattr(user, "full_name", str(user)),
            "phone": getattr(user, "phone", None),
            "email": getattr(user, "email", None),
        }
