import hashlib

from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    SearchVector,
    TrigramSimilarity,
)
from django.core.cache import cache
from django.db.models import Case, IntegerField, Q, Value, When

from .models import Product


class ProductSearchService:
    @staticmethod
    def search_products(query, limit=100, page=1, per_pages=10, use_cache=True):
        if not query:
            return {"count": 0, "products": []}

        # Кэш
        cache_key = f"product_search_{hashlib.md5(f'{query}_{limit}_{page}_{per_pages}'.encode()).hexdigest()}"
        if use_cache:
            cached_results = cache.get(cache_key)
            if cached_results is not None:
                return cached_results

        # Базовый запрос
        base_query = Product.objects.filter(moderation_type="approved")

        # Полнотекстовый поиск
        search_query = SearchQuery(query)
        products = base_query.annotate(
            search=SearchVector("name"),
            rank=SearchRank(SearchVector("name"), search_query),
            similarity=TrigramSimilarity("name", query),
        ).annotate(
            priority=Case(
                When(name__iexact=query, then=Value(1)),
                When(name__istartswith=query, then=Value(2)),
                When(name__icontains=query, then=Value(3)),
                default=Value(4),
                output_field=IntegerField(),
            )
        )

        # Фильтр: короткие слова ищем через icontains, длинные — через триграммы и полнотекст
        if len(query) < 3:
            products = products.filter(Q(name__icontains=query))
        else:
            threshold = 0.3
            products = products.filter(
                Q(search=search_query) | Q(similarity__gt=threshold)
            )

        # Сортировка
        products = products.order_by("priority", "-rank", "-similarity")

        # Оптимизация выборки
        products = products.only(
            "id", "name", "slug", "price", "discount"
        ).prefetch_related("images")

        # Пагинация
        count_check = products[: limit + 1].count()
        total_count = count_check if count_check <= limit else limit + 1

        start = (page - 1) * per_pages
        end = start + per_pages
        if end > limit:
            end = limit

        paginated_products = products[start:end]

        result = {"count": total_count, "products": paginated_products}

        if use_cache:
            cache.set(cache_key, result, 60 * 30)

        return result

    @staticmethod
    def create_search_indexes():
        """
        Метод для создания необходимых индексов в базе данных.
        Этот метод должен быть вызван при миграции базы данных.
        """
        from django.db import connection

        # Создаем расширение pg_trgm, если оно еще не создано
        with connection.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

            # Создаем GIN индекс для полнотекстового поиска
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS product_name_search_idx 
                ON products_product USING GIN (to_tsvector('simple', name));
            """
            )

            # Создаем GIN индекс для триграммного поиска
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS product_name_trgm_idx 
                ON products_product USING GIN (name gin_trgm_ops);
            """
            )
