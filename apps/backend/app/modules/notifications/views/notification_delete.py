from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Notification


class NotificationDeleteView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    def delete(self, request):
        ids = request.data.get("ids")
        all = request.data.get("deleteAll")
        if ids:
            Notification.objects.filter(
                id__in=ids.split(","), user=request.user
            ).delete()
            return Response({"success": True}, status=status.HTTP_200_OK)
        elif all:
            Notification.objects.filter(user=request.user).delete()
            return Response({"success": True}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Неверные параметры"}, status=status.HTTP_400_BAD_REQUEST
        )
