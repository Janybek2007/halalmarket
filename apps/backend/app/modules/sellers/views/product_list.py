from modules.products.models import Product
from modules.products.serializers import ProductSerializer
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.response import Response
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from .base import SellerBaseView


class ProductListView(SellerBaseView):
    permission_classes = [IsActiveSeller]
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

        products = Product.objects.filter(seller=seller)

        _to = request.query_params.get("_to")
        products, target_product = prioritize_to_parameter(
            products, _to, fields=["id", "slug"]
        )

        return get_paginated_response_with_priority(
            paginator=self.pagination_class(),
            queryset=products,
            request=request,
            serializer_class=ProductSerializer,
            target_item=target_product,
            context={"request": request},
        )
