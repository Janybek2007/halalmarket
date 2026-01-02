from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsTokenAuthenticated
from ..serializers import PasswordChangeSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsTokenAuthenticated]

    def patch(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data["old_password"]):
                user.set_password(serializer.validated_data["new_password"])
                user.save()
                return Response({"success": True}, status=status.HTTP_200_OK)
            return Response(
                {"error": "Неверный текущий пароль"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
