import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Category


@receiver(pre_save, sender=Category)
def delete_old_image(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_image = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return

    new_image = instance.image
    if old_image and old_image != new_image:
        old_image_path = old_image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)
