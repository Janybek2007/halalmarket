from django.shortcuts import get_object_or_404
from modules.users.permissions import IsAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Category


class CategoryDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        delete_children = (
            request.query_params.get("delete_children", "").lower() == "true"
        )

        has_children = Category.objects.filter(parent=category).exists()

        if has_children and not delete_children:
            return Response(
                {
                    "error": "Нельзя удалить категорию, у которой есть дочерние категории. Используйте параметр delete_children=true для удаления вместе с дочерними категориями."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hasattr(category, "products") and category.products.exists():
            return Response(
                {
                    "error": "Нельзя удалить категорию, у которой есть связанные продукты"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if delete_children and has_children:
            child_categories = Category.objects.filter(parent=category)

            for child in child_categories:
                if hasattr(child, "products") and child.products.exists():
                    return Response(
                        {
                            "error": f"Нельзя удалить дочернюю категорию '{child.name}', у которой есть связанные продукты"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            child_categories.delete()

        category.delete()

        return Response({"success": True})
