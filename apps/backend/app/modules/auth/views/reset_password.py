from modules.users.models import Token, TokenType, User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ResetPasswordSerializer


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token_id = serializer.validated_data.get("token")
            if not token_id:
                return Response(
                    {"error": "Требуется параметр token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                token = Token.objects.get(
                    token=token_id, token_type=TokenType.RESET_PASSWORD
                )
                if token.is_expired:
                    return Response(
                        {"error": "Токен истек"}, status=status.HTTP_400_BAD_REQUEST
                    )

                user = token.user
                user.set_password(serializer.validated_data["new_password"])
                user.save()

                return Response({"success": True})
            except Token.DoesNotExist:
                return Response(
                    {"error": "Неверный токен"}, status=status.HTTP_400_BAD_REQUEST
                )
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
