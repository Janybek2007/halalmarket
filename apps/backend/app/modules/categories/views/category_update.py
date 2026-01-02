from django.shortcuts import get_object_or_404
from modules.users.permissions import IsAdmin
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Category
from ..serializers import CategorySerializer


class CategoryUpdateView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, slug):
        category = get_object_or_404(Category, slug=slug)

        if "parent_id" in request.data and request.data["parent_id"] == "null":
            category.parent = None
            category.save()
            return Response({"success": True})

        serializer = CategorySerializer(category, data=request.data, partial=True)

        if serializer.is_valid():
            parent_id = serializer.validated_data.get("parent_id")

            if parent_id == "null" or parent_id == "":
                category.parent = None
                category.save()
                return Response({"success": True})
            elif parent_id:
                if int(parent_id) == int(category.id):
                    return Response(
                        {
                            "error": "Категория не может быть своим собственным родителем"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    parent = Category.objects.get(id=parent_id)
                    if self._is_descendant(parent, category):
                        return Response(
                            {
                                "error": "Нельзя сделать категорию потомком её собственного потомка"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                except Category.DoesNotExist:
                    return Response(
                        {"error": "Родительская категория не найдена"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            order = serializer.validated_data.get("order", None)
            parent_id = serializer.validated_data.get("parent_id", category.parent_id)

            if order is not None:
                current_order = category.order

                if parent_id:
                    existing_category = (
                        Category.objects.filter(order=order, parent_id=int(parent_id))
                        .exclude(id=int(category.id))
                        .first()
                    )
                else:
                    existing_category = (
                        Category.objects.filter(order=order, parent__isnull=True)
                        .exclude(id=int(category.id))
                        .first()
                    )

                if existing_category:
                    existing_category.order = current_order
                    existing_category.save()

            serializer.save()
            return Response({"success": True})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _is_descendant(self, potential_descendant, ancestor):
        if potential_descendant.parent is None:
            return False

        if int(potential_descendant.parent.id) == int(ancestor.id):
            return True

        return self._is_descendant(potential_descendant.parent, ancestor)
