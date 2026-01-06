from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from modules.sellers.models import Seller, SellerStatus
from modules.users.permissions import IsAdmin


class AdminSellersUpdateStatusView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request):
        status_value = request.data.get("status")
        ids = request.data.get("ids", [])

        if not status_value or status_value not in [
            SellerStatus.ACTIVE,
            SellerStatus.BLOCKED,
        ]:
            return Response(
                {"error": "Неверный статус. Допустимые значения: active, blocked"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not ids:
            return Response(
                {"error": "Необходимо указать хотя бы один ID продавца"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sellers = Seller.objects.filter(id__in=ids).select_related("user")
        sellers_to_update = [s for s in sellers if s.status != status_value]

        from ..tasks import send_seller_status_notification

        for seller in sellers_to_update:
            if seller.user and seller.user.email:
                send_seller_status_notification.delay(
                    user_id=int(seller.user.id),
                    status_value=status_value,
                )

        updated_count = Seller.objects.filter(
            id__in=[int(s.id) for s in sellers_to_update]
        ).update(status=status_value)

        return Response(
            {
                "success": True,
                "updated_count": updated_count,
            }
        )
