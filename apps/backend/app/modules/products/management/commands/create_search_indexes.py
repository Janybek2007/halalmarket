from django.core.management.base import BaseCommand
from modules.products.search_service import ProductSearchService


class Command(BaseCommand):
    help = "Создает индексы для поиска продуктов (PostgreSQL full-text + trigram)"

    def handle(self, *args, **kwargs):
        self.stdout.write("Создание индексов для поиска продуктов...")
        ProductSearchService.create_search_indexes()
        self.stdout.write(self.style.SUCCESS("Индексы успешно созданы!"))
