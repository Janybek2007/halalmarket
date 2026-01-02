from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination

from ..search_service import ProductSearchService
from ..serializers import ProductSearchSerializer


class ProductSearchView(APIView):
    permission_classes = [AllowAny]
    pagination_class = BasePagination

    def get(self, request):
        query = request.query_params.get("q", "")
        paginator = self.pagination_class()
        page_number = request.query_params.get("page", 1)
        per_pages = request.query_params.get("per_pages", 10)

        try:
            page_number = int(page_number)
            per_pages = min(int(per_pages), 100)
        except ValueError:
            page_number = 1
            per_pages = 10

        if not query:
            return Response(
                {"error": "Параметр 'q' обязателен для поиска"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        search_limit = 100
        search_result = ProductSearchService.search_products(
            query, limit=search_limit, page=page_number, per_pages=per_pages
        )

        if search_result["count"] == 0:
            return Response(
                {
                    "count": 0,
                    "next": None,
                    "previous": None,
                    "results": [],
                }
            )

        products = search_result["products"]

        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSearchSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ProductSearchSerializer(products, many=True)
        return Response(
            {
                "count": search_result["count"],
                "next": None,
                "previous": None,
                "results": serializer.data,
            }
        )
