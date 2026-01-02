from django.http import JsonResponse
from modules.categories.models import Category
from modules.products.models import Product
from rest_framework.response import Response
from rest_framework.views import APIView


class ProductsListView(APIView):
    """Эндпоинт для получения списка продуктов"""

    def get(self, request):
        """Возвращает slug и updated_at для всех продуктов"""
        try:
            products = Product.objects.filter(moderation_type="approved").values(
                "slug", "updated_at"
            )

            data = []
            for product in products:
                data.append(
                    {"slug": product["slug"], "updated_at": product["updated_at"]}
                )

            return Response(data, status=200)

        except Exception as e:
            return Response(
                {"error": f"Ошибка при получении продуктов: {str(e)}"}, status=500
            )


class CategoriesListView(APIView):
    """Эндпоинт для получения списка категорий"""

    def get(self, request):
        """Возвращает slug и updated_at для всех категорий"""
        try:
            categories = Category.objects.all().values("slug", "updated_at")

            data = []
            for category in categories:
                data.append(
                    {"slug": category["slug"], "updated_at": category["updated_at"]}
                )

            return Response(data, status=200)

        except Exception as e:
            return Response(
                {"error": f"Ошибка при получении категорий: {str(e)}"}, status=500
            )
