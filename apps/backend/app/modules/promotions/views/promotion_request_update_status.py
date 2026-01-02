from modules.users.permissions import IsAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Promotion, PromotionStatus


class PromotionRequestUpdateStatusView(APIView):
    """Представление для обновления статуса заявок на акции"""

    permission_classes = [IsAdmin]

    def post(self, request):
        promotion_ids = request.data.get("ids", [])
        action = request.data.get("action")

        if not promotion_ids:
            return Response(
                {"error": "Требуется массив ID акций"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action not in ["approve", "reject"]:
            return Response(
                {"error": "Действие должно быть 'approve' или 'reject'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        promotions = Promotion.objects.filter(
            id__in=promotion_ids, status=PromotionStatus.PENDING
        )

        if not promotions.exists():
            return Response(
                {
                    "error": "Акции не найдены или не имеют статус 'Ожидает подтверждения'"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        sellers_promotions = {}
        for promotion in promotions:
            if promotion.seller not in sellers_promotions:
                sellers_promotions[promotion.seller] = []
            sellers_promotions[promotion.seller].append(promotion)

        new_status = (
            PromotionStatus.ACTIVE if action == "approve" else PromotionStatus.REJECTED
        )
        updated_ids = []

        for seller, seller_promotions in sellers_promotions.items():
            promotions_data = []
            for promotion in seller_promotions:
                promotion.status = new_status
                promotion.save()
                updated_ids.append(int(promotion.id))

                if action == "approve":
                    try:
                        discount_value = int(promotion.discount.strip("%"))
                        for product in promotion.products.all():
                            product.discount = discount_value
                            product.save()
                    except (ValueError, AttributeError):
                        pass

                promotions_data.append(
                    {
                        "id": promotion.id,
                        "discount": promotion.discount,
                        "expires_at": str(promotion.expires_at),
                    }
                )

            if hasattr(seller, "user") and seller.user:
                from ..tasks import send_promotion_status_notification

                send_promotion_status_notification.delay(
                    seller_user_id=int(seller.user.id),
                    action=action,
                    promotions_data=promotions_data,
                )

        return Response({"success": True, "updated_promotions": updated_ids})
