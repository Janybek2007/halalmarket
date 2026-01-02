from rest_framework import serializers

from .models import Order, OrderGroup


class OrderSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "quantity",
            "created_at",
            "total_price",
        ]
        read_only_fields = ["id", "created_at", "total_price"]

    def get_product(self, obj):
        product = obj.product
        images = product.images.all()
        image_list = [{"id": img.id, "image": img.image.url} for img in images]

        return {
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "price": product.price,
            "discount": product.discount or 0,
            "images": image_list,
        }

    def get_total_price(self, obj):
        """
        Рассчитывает общую стоимость товара с учетом количества.
        Использует тот же алгоритм расчета скидки, что и на клиенте (целочисленное значение).
        """
        price = obj.product.price
        discount = obj.product.discount or 0
        # discountedPrice: parseInt(String(price - (price * Number(discount)) / 100))
        discounted = int(price - (price * discount) / 100)
        return discounted * obj.quantity


class OrderGroupSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True, read_only=True)
    user = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderGroup
        fields = [
            "id",
            "status",
            "created_at",
            "delivery_date",
            "orders",
            "user",
            "total_price",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "orders",
            "user",
            "total_price",
            "delivery_date",
        ]

    def get_user(self, obj):
        user = obj.user
        return {
            "id": user.id,
            "full_name": getattr(user, "full_name", str(user)),
            "phone": getattr(user, "phone", None),
            "email": getattr(user, "email", None),
        }

    def get_total_price(self, obj):
        """
        Рассчитывает общую стоимость всех товаров в заказе.
        Использует тот же алгоритм расчета скидки, что и на клиенте (целочисленное значение).
        """
        total = 0
        for order in obj.orders.all():
            price = order.product.price
            discount = getattr(order.product, "discount", 0) or 0
            # discountedPrice: parseInt(String(price - (price * Number(discount)) / 100))
            discounted = int(price - (price * discount) / 100)
            total += discounted * order.quantity
        return total
