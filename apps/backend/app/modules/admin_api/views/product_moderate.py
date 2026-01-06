from django.shortcuts import get_object_or_404
from modules.products.models import ModerationType, Product
from modules.users.permissions import IsAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class AdminProductModerateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, id):
        status_value = request.data.get("status")
        try:
            status_enum = ModerationType(status_value.lower())
            if status_enum not in [ModerationType.APPROVED, ModerationType.REJECTED]:
                raise ValueError(
                    "Некорректный статус. Возможные значения: approved, rejected"
                )
            status_value = status_enum.value
        except (ValueError, AttributeError):
            return Response(
                {"error": "Неверный статус. Допустимые значения: approved, rejected"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, id=id)

        if product.moderation_type == status_enum.value:
            return Response(
                {
                    "message": f"Статус продукта '{product.name}' уже установлен на '{status_enum.value}'",
                }
            )

        old_status = product.moderation_type
        product.moderation_type = status_enum.value
        product.save()

        seller_id = None
        if hasattr(product, "seller") and product.seller:
            seller = product.seller
            if seller and hasattr(seller, "id"):
                seller_id = int(seller.id)

        if seller_id and hasattr(seller, "user") and seller.user:
            if old_status != status_enum.value:
                from ..tasks import send_product_moderation_notification

                status_mapping = {
                    ModerationType.APPROVED: "одобрен",
                    ModerationType.REJECTED: "отклонен",
                    ModerationType.PENDING: "на модерации",
                }
                status_text = status_mapping.get(status_enum, "на модерации")

                send_product_moderation_notification.delay(
                    seller_user_id=int(seller.user.id),
                    product_name=product.name,
                    product_slug=product.slug,
                    status_value=status_enum.value,
                    status_text=status_text,
                    moderation_notes=getattr(product, "moderation_notes", ""),
                )

        return Response(
            {
                "success": True,
            }
        )
