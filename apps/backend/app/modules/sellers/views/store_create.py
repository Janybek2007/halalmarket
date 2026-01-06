from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from ..models import Seller
from .base import SellerBaseView


class SellerStoreCreateView(SellerBaseView):
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

        error = self.validate_seller_status(seller)
        if error:
            return error

        name = request.data.get("store_name")
        logo = (
            request.FILES.get("store_logo") if "store_logo" in request.FILES else None
        )

        if not name:
            return Response(
                {"error": "Требуется название магазина"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        from ..serializers import SellerSerializer

        seller.store_name = name
        if logo:
            seller.store_logo = logo
        seller.save()
        seller_data = SellerSerializer(seller).data

        return Response(
            {"success": True, "seller_data": seller_data},
            status=status.HTTP_201_CREATED,
        )
