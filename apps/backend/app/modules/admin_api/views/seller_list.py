from django.db.models import Q
from modules.sellers.models import Seller
from modules.users.permissions import IsAdmin
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..serializers import AdminSellerSerializer


class AdminSellerListView(APIView):
    permission_classes = [IsAdmin]
    pagination_class = BasePagination

    def get(self, request):
        search = request.query_params.get("search")
        _to = request.query_params.get("_to")
        status = request.query_params.get("status")

        sellers = Seller.objects.all()

        if search:
            sellers = sellers.filter(
                Q(user__email__icontains=search)
                | Q(user__phone__icontains=search)
                | Q(user__full_name__icontains=search)
            )

        if status in ["active", "blocked"]:
            sellers = sellers.filter(status=status)

        sellers, target_seller = prioritize_to_parameter(sellers, _to)

        return get_paginated_response_with_priority(
            paginator=self.pagination_class(),
            queryset=sellers,
            request=request,
            serializer_class=AdminSellerSerializer,
            target_item=target_seller,
        )
