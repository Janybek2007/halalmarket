from django.db import models
from shared.utils.to_slug import toSlug


class Category(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Идентификатор")
    name = models.CharField(max_length=255, verbose_name="Название")
    image = models.FileField(
        upload_to="categories/", verbose_name="Изображение", null=True, blank=True
    )
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL-ссылка")
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
        verbose_name="Родительская категория",
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        base_slug = toSlug(self.name)
        slug = base_slug
        counter = 1

        while Category.objects.filter(slug=slug).exclude(id=self.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        self.slug = slug
        super().save(*args, **kwargs)
