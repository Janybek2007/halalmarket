from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import PromotionCreateSerializer


class PromotionRequestView(APIView):
    """Представление для создания заявки на акцию"""

    permission_classes = [IsActiveSeller]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PromotionCreateSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            promotion = serializer.save()

            seller = request.user.seller
            seller_name = (
                seller.store_name
                if hasattr(seller, "store_name")
                else request.user.full_name
            )
            products_count = promotion.products.count()

            from ..tasks import send_promotion_request_notification

            send_promotion_request_notification.delay(
                promotion_id=int(promotion.id),
                seller_name=seller_name,
                discount=promotion.discount,
                products_count=products_count,
            )

            return Response(
                {
                    "success": True,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
