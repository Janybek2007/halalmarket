from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    parent_id = serializers.CharField(required=False, allow_null=True, write_only=True)
    parent = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "image",
            "slug",
            "parent",
            "parent_id",
            "order",
            "created_at",
        ]
        read_only_fields = ["id", "slug", "created_at"]

    def get_parent(self, obj):
        if obj.parent and not self.context.get("exclude_parent", False):
            return {
                "id": obj.parent.id,
                "name": obj.parent.name,
                "slug": obj.parent.slug,
            }
        return None

    def validate_parent_id(self, value):
        if value is None or value == "null" or value == "":
            return None

        try:
            Category.objects.get(id=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError("Родительская категория не найдена.")

        return value

    def create(self, validated_data):
        parent_id = validated_data.pop("parent_id", None)
        instance = super().create(validated_data)

        if parent_id:
            parent = Category.objects.get(id=int(parent_id))
            instance.parent = parent
            instance.save()

        return instance

    def update(self, instance, validated_data):
        parent_id = validated_data.pop("parent_id", None)

        instance = super().update(instance, validated_data)

        if parent_id is not None:
            if parent_id:
                try:
                    parent = Category.objects.get(id=int(parent_id))
                    instance.parent = parent
                except Category.DoesNotExist:
                    pass
            else:
                instance.parent = None

            instance.save()

        return instance
