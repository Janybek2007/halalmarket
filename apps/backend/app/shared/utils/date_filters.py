from datetime import datetime
from typing import Optional


def filter_queryset_by_date(
    queryset,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    date_field: str = "created_at",
):
    is_list = isinstance(queryset, list)
    if start_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            if is_list:
                queryset = [
                    obj for obj in queryset if getattr(obj, date_field).date() >= start
                ]
            else:
                queryset = queryset.filter(**{f"{date_field}__date__gte": start})
        except (ValueError, TypeError):
            pass
    if end_date:
        try:
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
            if is_list:
                queryset = [
                    obj for obj in queryset if getattr(obj, date_field).date() <= end
                ]
            else:
                queryset = queryset.filter(**{f"{date_field}__date__lte": end})
        except (ValueError, TypeError):
            pass
    return queryset
