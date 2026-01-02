import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Promotion


@receiver(pre_save, sender=Promotion)
def delete_old_thumbnail(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_thumbnail = sender.objects.get(pk=instance.pk).thumbnail
    except sender.DoesNotExist:
        return

    new_thumbnail = instance.thumbnail
    if old_thumbnail and old_thumbnail != new_thumbnail:
        old_thumbnail_path = old_thumbnail.path
        if os.path.isfile(old_thumbnail_path):
            os.remove(old_thumbnail_path)
