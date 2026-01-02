from modules.users.permissions import IsUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..models import OrderGroup, OrderStatus
from ..serializers import OrderGroupSerializer


class OrderListView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        to_id = request.query_params.get("_to")
        statuses_param = request.query_params.get("statuses")

        OrderGroup.objects.filter(user=request.user, orders__isnull=True).delete()

        queryset = OrderGroup.objects.filter(user=request.user)

        if statuses_param:
            statuses = statuses_param.split(",")
            valid_statuses = [
                status for status in statuses if status in dict(OrderStatus.choices)
            ]
            if valid_statuses:
                queryset = queryset.filter(status__in=valid_statuses)

        queryset = queryset.order_by("-created_at")

        queryset, target_order = prioritize_to_parameter(queryset, to_id)

        paginator = PageNumberPagination()
        paginator.page_size = int(request.query_params.get("per_pages", 10))

        return get_paginated_response_with_priority(
            paginator=paginator,
            queryset=queryset,
            request=request,
            serializer_class=OrderGroupSerializer,
            target_item=target_order,
        )
