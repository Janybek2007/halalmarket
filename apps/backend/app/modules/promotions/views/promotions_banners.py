from django.db import models
from django.utils import timezone
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination

from ..models import Promotion, PromotionStatus
from ..serializers import PromotionSerializer


class PromotionsBannersView(APIView):
    """Представление для получения списка активных акций"""

    def get(self, request):
        now = timezone.now()
        queryset = Promotion.objects.filter(
            status=PromotionStatus.ACTIVE, is_expired=False
        ).filter(models.Q(expires_at__isnull=False) & models.Q(expires_at__gt=now))

        paginator = BasePagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = PromotionSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)
