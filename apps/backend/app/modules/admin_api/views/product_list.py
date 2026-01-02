from modules.products.models import Product
from modules.users.permissions import IsAdmin
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..serializers import AdminProductSerializer


class AdminProductListView(APIView):
    permission_classes = [IsAdmin]
    pagination_class = BasePagination

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        from shared.utils.date_filters import filter_queryset_by_date

        products = filter_queryset_by_date(
            Product.objects.all(), start_date, end_date, date_field="created_at"
        )

        _to = request.query_params.get("_to")
        products, target_product = prioritize_to_parameter(
            products, _to, fields=["id", "slug"]
        )

        return get_paginated_response_with_priority(
            paginator=self.pagination_class(),
            queryset=products,
            request=request,
            serializer_class=AdminProductSerializer,
            target_item=target_product,
        )
