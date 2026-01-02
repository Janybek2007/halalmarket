from modules.products.models import ModerationType
from modules.products.serializers import ProductSerializer
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .base import SellerBaseView


class ProductCreateView(SellerBaseView):
    permission_classes = [IsActiveSeller]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProductSerializer(
            data=request.data, context={"request": request, "seller": seller}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product = serializer.save()
        product.moderation_type = ModerationType.PENDING
        product.save()

        from ..tasks import send_product_notification_task

        send_product_notification_task.delay(
            product_id=int(product.id), seller_name=seller.user.full_name
        )

        return Response({"success": True}, status=status.HTTP_201_CREATED)
