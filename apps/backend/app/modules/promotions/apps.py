from django.apps import AppConfig


class PromotionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.promotions"

    def ready(self):
        import modules.promotions.signals
