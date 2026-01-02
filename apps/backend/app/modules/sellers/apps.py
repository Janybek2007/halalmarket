from django.apps import AppConfig


class SellersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.sellers"

    def ready(self):
        import modules.sellers.signals
