from rest_framework.response import Response


def get_paginated_response_with_priority(
    paginator, queryset, request, serializer_class, target_item, **context
):
    """
    Универсальная функция для получения пагинированного ответа с приоритезированным элементом

    Args:
        paginator: Объект пагинатора
        queryset: QuerySet для пагинации
        request: Request объект
        serializer_class: Класс сериализатора
        target_item: Целевой элемент для приоритезации (может быть None)
        **context: Дополнительный контекст для сериализатора

    Returns:
        Response с пагинированными данными
    """
    page = paginator.paginate_queryset(queryset, request)

    if page is not None:
        if target_item and not any(r.id == target_item.id for r in page):
            serializer = serializer_class(page, many=True, **context)
            target_serializer = serializer_class(target_item, **context)
            page_data = serializer.data
            page_data.insert(0, target_serializer.data)

            response_data = paginator.get_paginated_response([]).data
            response_data["results"] = page_data
            response_data["count"] += 1
            return Response(response_data)
        else:
            serializer = serializer_class(page, many=True, **context)
            return paginator.get_paginated_response(serializer.data)

    serializer = serializer_class(queryset, many=True, **context)
    return paginator.get_paginated_response(serializer.data)
