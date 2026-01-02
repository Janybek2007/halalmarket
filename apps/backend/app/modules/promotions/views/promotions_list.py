from modules.users.models import UserRole
from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..models import Promotion
from ..serializers import PromotionListSerializer


class PromotionsListView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    """Представление для получения списка акций продавца"""

    def get(self, request):
        to_param = request.query_params.get("_to")

        if request.user.role == UserRole.ADMIN:
            queryset = Promotion.objects.all()
        else:
            seller = request.user.seller
            queryset = Promotion.objects.filter(seller=seller)

        queryset, target_promotion = prioritize_to_parameter(queryset, to_param)

        paginator = BasePagination()

        return get_paginated_response_with_priority(
            paginator=paginator,
            queryset=queryset,
            request=request,
            serializer_class=PromotionListSerializer,
            target_item=target_promotion,
        )
