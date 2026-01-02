from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from modules.users.permissions import IsTokenAuthenticated
from shared.utils.token import refresh_access_token


class RefreshView(APIView):
    permission_classes = [IsTokenAuthenticated]

    def patch(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Требуется refresh токен"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user, access_token = refresh_access_token(refresh_token)

            response_data = {
                "user_id": user.id,
                "tokens": {
                    "access": access_token,
                },
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response(
                {"error": "Недействительный токен"}, status=status.HTTP_401_UNAUTHORIZED
            )
