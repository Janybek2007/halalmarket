from modules.products.models import Product, Review
from modules.products.serializers import ReviewSerializer
from modules.users.permissions import IsActiveSeller
from rest_framework import status
from rest_framework.response import Response
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..models import Store
from .base import SellerBaseView


class StoreReviewsListView(SellerBaseView):
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

        stores = Store.objects.filter(seller=seller)
        products = Product.objects.filter(store__in=stores)
        reviews = Review.objects.filter(product__in=products).order_by("-created_at")

        _to = request.query_params.get("_to")
        reviews, target_review = prioritize_to_parameter(
            reviews, _to, model_class=Review
        )

        paginator = self.pagination_class()
        paginator.page_size = int(request.query_params.get("per_pages", 10))

        return get_paginated_response_with_priority(
            paginator=paginator,
            queryset=reviews,
            request=request,
            serializer_class=ReviewSerializer,
            target_item=target_review,
        )
