from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.token import generate_and_store_tokens

from ..serializers import UserRegisterSerializer
from modules.auth.tasks import send_welcome_notification


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            access_token, refresh_token = generate_and_store_tokens(user)

            send_welcome_notification.delay(
                user_id=int(user.id),
                user_email=user.email,
                created_at=user.created_at.strftime("%d.%m.%Y %H:%M"),
            )

            response_data = {
                "user_id": user.id,
                "tokens": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
