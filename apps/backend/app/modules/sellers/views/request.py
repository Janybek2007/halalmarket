from django.core.cache import cache
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.phone_validator import PHONE_ERROR_MESSAGE, validate_phone_format


class SellerRequestView(APIView):
    """
    Создание заявки на регистрацию продавца.
    Rate-limit: один запрос с одного номера каждые 10 минут.
    """

    RATE_LIMIT_TTL = 60 * 60

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response(
                {"error": "Требуется номер телефона"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            phone = validate_phone_format(phone)
        except ValidationError:
            return Response(
                {"error": PHONE_ERROR_MESSAGE}, status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f"seller_request_rate_{phone}"
        if cache.get(cache_key):
            return Response(
                {"error": "Вы уже отправляли заявку. Попробуйте позже."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        cache.set(cache_key, True, timeout=self.RATE_LIMIT_TTL)

        from modules.sellers.tasks import send_seller_request_notification

        send_seller_request_notification.delay(phone=phone)

        return Response(
            {"success": True, "message": "Заявка успешно отправлена"},
            status=status.HTTP_200_OK,
        )
