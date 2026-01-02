from django.db.models import Count
from modules.orders.models import OrderGroup
from modules.orders.serializers import OrderGroupSerializer
from modules.sellers.models import Store
from rest_framework import status
from rest_framework.response import Response
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from .base import SellerBaseView


class SellerOrderListView(SellerBaseView):
    pagination_class = BasePagination

    def get(self, request):
        error = self.validate_seller_role(request.user)
        if error:
            return error

        seller = self.get_seller(request.user)
        if not seller:
            return Response(
                {"error": "Профиль продавца не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        stores = Store.objects.filter(seller=seller)
        order_groups = OrderGroup.objects.filter(
            orders__product__store__in=stores
        ).distinct()

        empty_groups = order_groups.annotate(orders_count=Count("orders")).filter(
            orders_count=0
        )
        empty_groups.delete()

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        from shared.utils.date_filters import filter_queryset_by_date

        order_groups = filter_queryset_by_date(
            order_groups, start_date, end_date, date_field="created_at"
        )

        _to = request.query_params.get("_to")
        order_groups, target_order = prioritize_to_parameter(
            order_groups, _to, model_class=OrderGroup
        )

        return get_paginated_response_with_priority(
            paginator=self.pagination_class(),
            queryset=order_groups,
            request=request,
            serializer_class=OrderGroupSerializer,
            target_item=target_order,
        )
