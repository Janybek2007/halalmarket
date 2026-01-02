import logging

from modules.products.models import Product, ProductImage
from modules.products.serializers import ProductSerializer
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .base import SellerBaseView

logger = logging.getLogger(__name__)


class ProductUpdateView(SellerBaseView):
    permission_classes = [IsActiveSeller]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, id):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            product = Product.objects.get(id=id, store__seller=seller)
        except Product.DoesNotExist:
            return Response(
                {"error": "Продукт не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        images_files = request.FILES.getlist("images_files")
        images_deleted_ids = request.data.getlist("images_deleted") or []

        for img_id in images_deleted_ids:
            try:
                img_obj = ProductImage.objects.get(id=int(img_id), product=product)
                img_obj.delete()
                logger.info(f"Deleted image with ID: {img_id}")
            except ProductImage.DoesNotExist:
                logger.warning(f"Tried to delete non-existing image with ID: {img_id}")

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        logger.info(f"Updated product {product.id}")

        for file in images_files:
            product.images.create(image=file)
            logger.info(f"Added new image: {file.name}")

        return Response({"success": True}, status=status.HTTP_200_OK)
