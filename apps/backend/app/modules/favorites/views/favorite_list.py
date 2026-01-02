from modules.users.permissions import IsUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from ..models import Favorite
from ..serializers import FavoriteSerializer


class FavoriteListView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        """
        Получение списка избранных товаров пользователя
        """
        favorites = Favorite.objects.filter(user=request.user)
        paginator = PageNumberPagination()
        paginator.page_size = int(request.query_params.get("per_pages", 10))
        page = paginator.paginate_queryset(favorites, request)
        serializer = FavoriteSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
