from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Category
from ..serializers import CategorySerializer


class CategoryListView(APIView):

    def get(self, request):
        slug = request.query_params.get("slug", None)
        parent_slug = request.query_params.get("parent", None)
        is_null_parent = request.query_params.get("is_null_parent", False)
        get_childs = request.query_params.get("get_childs", False)

        if slug:
            category = get_object_or_404(Category, slug=slug)
            serializer = CategorySerializer(category)
            return Response([serializer.data])

        if parent_slug and parent_slug != "undefined":
            parent = get_object_or_404(Category, slug=parent_slug)
            categories = Category.objects.filter(parent=parent)
        elif is_null_parent == "true":
            categories = Category.objects.filter(parent=None)
        elif is_null_parent == "false":
            categories = Category.objects.filter(parent__isnull=False)
        else:
            categories = Category.objects.all()

        categories = categories.order_by("order")

        if get_childs == "true":
            serializer = CategorySerializer(categories, many=True)
            data = serializer.data
            for category_data in data:
                child_categories = Category.objects.filter(
                    parent__id=int(category_data["id"])
                )
                child_serializer = CategorySerializer(child_categories, many=True)
                category_data["childs"] = child_serializer.data
            return Response(data)

        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
