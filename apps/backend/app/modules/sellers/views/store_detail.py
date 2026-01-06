from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from ..serializers import SellerUpdateSerializer
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

        serializer = SellerUpdateSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            from ..serializers import SellerSerializer

            serializer.save()
            seller_data = SellerSerializer(seller).data
            return Response({"success": True, "store_data": seller_data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
