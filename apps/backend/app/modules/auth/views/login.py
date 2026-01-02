from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.token import generate_and_store_tokens

from ..serializers import UserLoginSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            access_token, refresh_token = generate_and_store_tokens(user)

            response_data = {
                "user_id": user.id,
                "tokens": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            }

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
