from modules.users.permissions import IsAdmin
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from modules.products.models import Product


class AdminProductDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, id):
        product = get_object_or_404(Product, id=id)

        product_name = product.name
        product_slug = product.slug

        seller = None
        if (
            hasattr(product, "store")
            and product.store
            and hasattr(product.store, "seller")
        ):
            seller = product.store.seller
            if seller and hasattr(seller, "user") and seller.user:
                from ..tasks import send_product_deleted_notification

                send_product_deleted_notification.delay(
                    seller_user_id=int(seller.user.id),
                    product_name=product_name,
                    product_slug=product_slug,
                )

        product.delete()
        return Response({"success": True})
