from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from ..models import Store
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

        name = request.data.get("name")
        logo = request.FILES.get("logo") if "logo" in request.FILES else None

        if not name:
            return Response(
                {"error": "Требуется название магазина"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        from ..serializers import StoreSerializer

        store = Store.objects.create(
            name=name,
            seller=seller,
            logo=logo,
        )
        store_data = StoreSerializer(store).data

        return Response(
            {"success": True, "store_data": store_data}, status=status.HTTP_201_CREATED
        )
