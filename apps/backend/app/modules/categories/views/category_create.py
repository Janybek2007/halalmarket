from django.db.models import Max
from modules.users.permissions import IsAdmin
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.to_slug import toSlug

from ..models import Category
from ..serializers import CategorySerializer


class CategoryCreateView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get("name")
            slug = toSlug(name)
            order = serializer.validated_data.get("order", None)

            if Category.objects.filter(slug=slug).exists():
                return Response(
                    {"error": "Категория с таким названием уже существует"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            parent_id = serializer.validated_data.get("parent_id", None)
            if order is None:
                if parent_id:
                    max_order = (
                        Category.objects.filter(parent_id=int(parent_id)).aggregate(
                            Max("order")
                        )["order__max"]
                        or 0
                    )
                else:
                    max_order = (
                        Category.objects.filter(parent__isnull=True).aggregate(
                            Max("order")
                        )["order__max"]
                        or 0
                    )
                serializer.validated_data["order"] = max_order + 1

            serializer.save(slug=slug)
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
