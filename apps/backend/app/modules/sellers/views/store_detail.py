from django.shortcuts import get_object_or_404
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from ..models import Store
from ..serializers import StoreUpdateSerializer
from .base import SellerBaseView


class SellerStoreDetailView(SellerBaseView):
    permission_classes = [IsActiveSeller]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        store = get_object_or_404(Store, seller=seller)

        serializer = StoreUpdateSerializer(store, data=request.data, partial=True)
        if serializer.is_valid():
            from ..serializers import StoreSerializer
            serializer.save()
            store_data = StoreSerializer(store).data
            return Response({"success": True, "store_data": store_data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
