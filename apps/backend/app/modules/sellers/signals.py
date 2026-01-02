import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Store


@receiver(pre_save, sender=Store)
def delete_old_logo(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_logo = sender.objects.get(pk=instance.pk).logo
    except sender.DoesNotExist:
        return

    new_logo = instance.logo
    if old_logo and old_logo != new_logo:
        old_logo_path = old_logo.path
        if os.path.isfile(old_logo_path):
            os.remove(old_logo_path)
