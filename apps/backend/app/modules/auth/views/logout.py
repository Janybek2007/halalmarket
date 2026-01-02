from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from modules.users.models import Token, TokenType
from modules.users.permissions import IsTokenAuthenticated


class LogoutView(APIView):
    permission_classes = [IsTokenAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            print(refresh_token)
            if refresh_token:
                token = Token.objects.get(
                    token=refresh_token, token_type=TokenType.REFRESH
                )
                token.delete()

            return Response({"success": True}, status=status.HTTP_200_OK)

        except Token.DoesNotExist:
            return Response(
                {"error": "Неверный токен"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception:
            return Response(
                {"error": "Ошибка выхода"}, status=status.HTTP_400_BAD_REQUEST
            )
