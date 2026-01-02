from django.core.paginator import Paginator
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BasePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "per_pages"
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except NotFound:
            per_page = self.get_page_size(request)
            self.paginator = Paginator(queryset, per_page)

            if self.paginator.num_pages > 0:
                self.page = self.paginator.page(self.paginator.num_pages)
            else:
                self.page = None

            self._page_out_of_range = True
            return []

    def get_paginated_response(self, data):
        if getattr(self, "_page_out_of_range", False):
            return Response(
                {
                    "_page_out_of_range": True,
                    "count": self.paginator.count if self.paginator else 0,
                    "next": None,
                    "previous": None,
                    "results": [],
                }
            )

        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )
