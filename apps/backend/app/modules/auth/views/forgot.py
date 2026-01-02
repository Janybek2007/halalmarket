import uuid

from django.utils import timezone
from modules.users.models import Token, TokenType, User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ForgotSerializer


class ForgotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=email)
                reset_token = Token.objects.create(
                    user=user,
                    token_type=TokenType.RESET_PASSWORD,
                    token=str(uuid.uuid4()),
                    expires_at=timezone.now() + timezone.timedelta(hours=24),
                )

                from app.modules.auth.tasks import send_password_reset_notification

                send_password_reset_notification.delay(
                    user_id=int(user.id), reset_token=reset_token.token
                )

                return Response({"success": True}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь с таким email не найден"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
