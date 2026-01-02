from modules.users.permissions import IsUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Favorite
from ..serializers import FavoriteCreateSerializer


class FavoriteToggleView(APIView):
    permission_classes = [IsUser]

    def post(self, request):
        """
        Переключение товара в избранном (добавление/удаление)
        """
        serializer = FavoriteCreateSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            product_id = serializer.validated_data["product_id"]
            favorite = Favorite.objects.filter(
                product_id=int(product_id), user=request.user
            ).first()

            if favorite:
                favorite.delete()
                return Response(
                    {"success": True, "action": "removed"}, status=status.HTTP_200_OK
                )
            else:
                serializer.save()
                return Response(
                    {"success": True, "action": "added"}, status=status.HTTP_200_OK
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
