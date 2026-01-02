from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from ..models import Notification
from ..serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    def get(self, request):
        """
        Получение списка уведомлений пользователя
        """
        queryset = Notification.objects.filter(user=request.user)

        is_read = request.query_params.get("is_read")
        if is_read is not None:
            is_read = is_read.lower() == "true"
            queryset = queryset.filter(is_read=is_read)

        paginator = PageNumberPagination()
        paginator.page_size = int(request.query_params.get("per_pages", 10))
        page = paginator.paginate_queryset(queryset, request)
        serializer = NotificationSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
