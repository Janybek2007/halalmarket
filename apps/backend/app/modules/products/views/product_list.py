from django.shortcuts import get_object_or_404
from modules.categories.models import Category
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.pagination import BasePagination

from ..models import ModerationType, Product
from ..serializers import ProductSerializer


class ProductListView(APIView):
    permission_classes = [AllowAny]
    pagination_class = BasePagination

    def get(self, request):
        with_category = (
            request.query_params.get("with_category", "false").lower() == "true"
        )

        if with_category:
            categories = Category.objects.filter(parent__isnull=True).order_by(
                "order", "name"
            )

            result = []
            for category in categories:
                subcategories = Category.objects.filter(parent=category)
                if subcategories.exists():
                    products = Product.objects.filter(
                        subcategory__in=subcategories,
                        moderation_type=ModerationType.APPROVED.value,
                    ).select_related("seller", "subcategory")[:8]
                else:
                    products = Product.objects.none()

                products_data = ProductSerializer(
                    products, many=True, context={"request": request}
                ).data

                category_data = {
                    "id": category.id,
                    "name": category.name,
                    "image": category.image.url if category.image else "",
                    "slug": category.slug,
                    "order": category.order,
                    "created_at": category.created_at,
                    "products": products_data,
                }

                result.append(category_data)

            return Response(result, status=status.HTTP_200_OK)

        category_slug = request.query_params.get("category", None)
        paginator = self.pagination_class()
        category_data = None

        if category_slug:
            category = get_object_or_404(Category, slug=category_slug)

            parent_data = None
            if category.parent:
                parent_data = {
                    "id": category.parent.id,
                    "name": category.parent.name,
                    "image": category.parent.image.url if category.parent.image else "",
                    "slug": category.parent.slug,
                    "order": category.parent.order,
                    "created_at": category.parent.created_at,
                }

            category_data = {
                "id": category.id,
                "name": category.name,
                "image": category.image.url if category.image else "",
                "slug": category.slug,
                "order": category.order,
                "created_at": category.created_at,
                "parent": parent_data,
            }

            if category.parent is None:
                subcategories = Category.objects.filter(parent=category)
                if subcategories.exists():
                    products = Product.objects.filter(
                        subcategory__in=subcategories, moderation_type="approved"
                    )
                else:
                    products = Product.objects.none()
            else:
                products = Product.objects.filter(
                    subcategory=category, moderation_type="approved"
                )
        else:
            products = Product.objects.filter(moderation_type="approved")

        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSerializer(
                page, many=True, context={"request": request}
            )
            response_data = paginator.get_paginated_response(serializer.data).data
            if category_data:
                response_data["category"] = category_data
            return Response(response_data)

        serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )
        response_data = {"results": serializer.data}
        if category_data:
            response_data["category"] = category_data
        return Response(response_data)
