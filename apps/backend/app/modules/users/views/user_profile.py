from modules.sellers.models import Seller
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsTokenAuthenticated
from ..serializers import UserSerializer


class UserProfileView(APIView):
    permission_classes = [IsTokenAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        user_data = serializer.data

        data = {
            "id": user_data["id"],
            "full_name": user_data["full_name"],
            "email": user_data["email"],
            "phone": user_data["phone"],
            "address": user_data.get("address"),
            "avatar": user_data.get("avatar"),
            "role": user_data["role"],
        }

        if user_data["role"] == "seller":
            try:
                from modules.sellers.models import Seller

                seller = Seller.objects.get(user=request.user)
                data["seller"] = {
                    "id": seller.id,
                    "status": seller.status,
                    "store_name": seller.store_name,
                    "store_logo": seller.store_logo.url if seller.store_logo else None,
                }
            except Seller.DoesNotExist:
                data["seller"] = None

        return Response(data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
