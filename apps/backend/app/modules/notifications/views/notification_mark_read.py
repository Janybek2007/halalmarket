from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Notification
from ..serializers import NotificationMarkReadSerializer


class NotificationMarkReadView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    def post(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            if data.get("markAll"):
                marked_count = Notification.objects.filter(
                    user=request.user, is_read=False
                ).update(is_read=True)
            else:
                ids = data["ids"]
                marked_count = Notification.objects.filter(
                    id__in=ids, user=request.user, is_read=False
                ).update(is_read=True)

            return Response(
                {"success": True, "marked_count": marked_count},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
