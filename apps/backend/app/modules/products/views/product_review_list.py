from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination
from shared.utils.priority_filter import prioritize_to_parameter
from shared.utils.priority_pagination import get_paginated_response_with_priority

from ..models import Product, Review
from ..serializers import ReviewSerializer


class ProductReviewListView(APIView):
    permission_classes = [AllowAny]
    pagination_class = BasePagination

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        paginator = self.pagination_class()
        reviews = product.reviews.all()

        _to = request.query_params.get("_to")
        reviews, target_review = prioritize_to_parameter(
            reviews, _to, model_class=Review
        )

        return get_paginated_response_with_priority(
            paginator, reviews, request, ReviewSerializer, target_review
        )
