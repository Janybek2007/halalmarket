from django.db.models import Q
from django.db.models.query import QuerySet


def get_target_item(to_param: str, model_class, fields=None):
    """
    Находит целевой элемент по to_param

    Args:
        to_param: Значение параметра _to (ID или slug)
        model_class: Класс модели для поиска
        fields: Список полей для поиска (по умолчанию ['id', 'slug'])

    Returns:
        Найденный объект или None
    """
    if not to_param or not model_class:
        return None

    search_fields = fields or ["id"]

    try:
        q_objects = Q()
        for field in search_fields:
            q_objects |= Q(**{field: to_param})

        return model_class.objects.get(q_objects)
    except model_class.DoesNotExist:
        return None


def prioritize_to_parameter(
    queryset: QuerySet, to_param: str, model_class=None, fields=None
):
    """
    Утилита для обработки параметра _to и размещения найденного элемента в начале списка результатов.

    Args:
        queryset: QuerySet, к которому применяется фильтрация
        to_param: Значение параметра _to (ID или slug)
        model_class: Класс модели (опционально, если передан queryset другой модели)
        fields: Список полей, по которым искать элемент (по умолчанию ['id', 'slug'])

    Returns:
        tuple: (queryset, target_item) - измененный queryset и целевой элемент
    """
    if not to_param:
        return queryset, None

    if model_class is None:
        model_class = queryset.model

    target_item = get_target_item(to_param, model_class, fields)

    if not target_item:
        return queryset, None

    if queryset.filter(id=target_item.id).exists():
        from django.db.models import Case, IntegerField, When

        preserved_order = Case(
            When(id=target_item.id, then=0), default=1, output_field=IntegerField()
        )

        return queryset.order_by(preserved_order), target_item
    else:
        return queryset, target_item
