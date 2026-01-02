from django.shortcuts import get_object_or_404
from modules.users.models import UserRole
from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Promotion


class PromotionDeleteView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    def delete(self, request, id):
        if request.user.role == UserRole.ADMIN:
            promotion = get_object_or_404(Promotion, id=id)
        else:
            promotion = get_object_or_404(Promotion, id=id, seller=request.user.seller)

        promotion.delete()
        return Response({"success": True})
