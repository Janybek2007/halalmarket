from modules.orders.models import Order
from modules.orders.serializers import OrderSerializer
from modules.sellers.models import Seller
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

        orders = Order.objects.filter(items__seller=seller).distinct()

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        from shared.utils.date_filters import filter_queryset_by_date

        orders = filter_queryset_by_date(
            orders, start_date, end_date, date_field="created_at"
        )

        _to = request.query_params.get("_to")
        orders, target_order = prioritize_to_parameter(orders, _to, model_class=Order)

        return get_paginated_response_with_priority(
            paginator=self.pagination_class(),
            queryset=orders,
            request=request,
            serializer_class=OrderSerializer,
            target_item=target_order,
        )
