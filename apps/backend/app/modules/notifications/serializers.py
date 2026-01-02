from rest_framework import serializers

from .models import Notification, PushSubscription


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "notification_type",
            "is_read",
            "created_at",
            "data",
        ]
        read_only_fields = ["id", "created_at"]


class PushSubscriptionSerializer(serializers.ModelSerializer):
    info_endpoint = serializers.CharField(write_only=True, required=False)
    info_keys_p256dh = serializers.CharField(write_only=True, required=False)
    info_keys_auth = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = PushSubscription
        fields = [
            "id",
            "endpoint",
            "p256dh",
            "auth",
            "browser",
            "device",
            "created_at",
            "updated_at",
            "info_endpoint",
            "info_keys_p256dh",
            "info_keys_auth",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "endpoint": {"required": False},
            "p256dh": {"required": False},
            "auth": {"required": False},
        }

    def validate(self, attrs):
        data = self.context["request"].data

        if "info_endpoint" in data or "info_endpoint" in attrs:
            attrs["endpoint"] = data.get("info_endpoint") or attrs.get("info_endpoint")
            attrs["p256dh"] = data.get("info_keys_p256dh") or attrs.get(
                "info_keys_p256dh"
            )
            attrs["auth"] = data.get("info_keys_auth") or attrs.get("info_keys_auth")

            attrs.pop("info_endpoint", None)
            attrs.pop("info_keys_p256dh", None)
            attrs.pop("info_keys_auth", None)

        attrs["browser"] = data.get("browser")
        attrs["device"] = data.get("device")

        errors = {}
        if not attrs.get("endpoint"):
            errors["info_endpoint"] = ["Обязательное поле."]
        if not attrs.get("p256dh"):
            errors["info_keys_p256dh"] = ["Обязательное поле."]
        if not attrs.get("auth"):
            errors["info_keys_auth"] = ["Обязательное поле."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        endpoint = validated_data.get("endpoint")

        subscription, created = PushSubscription.objects.update_or_create(
            user=user,
            endpoint=endpoint,
            defaults={
                "p256dh": validated_data.get("p256dh"),
                "auth": validated_data.get("auth"),
                "browser": validated_data.get("browser"),
                "device": validated_data.get("device"),
            },
        )

        return subscription


class NotificationMarkReadSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    all = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if not attrs.get("ids") and not attrs.get("all"):
            raise serializers.ValidationError(
                "Необходимо предоставить либо 'ids', либо 'all=True'"
            )
        return attrs
