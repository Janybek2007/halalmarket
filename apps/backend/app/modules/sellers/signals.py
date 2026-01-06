import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Seller


@receiver(pre_save, sender=Seller)
def delete_old_logo(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_seller = sender.objects.get(pk=instance.pk)
        old_logo = old_seller.store_logo
    except sender.DoesNotExist:
        return

    new_logo = instance.store_logo
    if old_logo and old_logo != new_logo:
        old_logo_path = old_logo.path
        if os.path.isfile(old_logo_path):
            os.remove(old_logo_path)
