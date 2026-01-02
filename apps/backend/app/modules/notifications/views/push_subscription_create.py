from modules.users.permissions import IsAdminOrActiveSeller
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import PushSubscription
from ..serializers import PushSubscriptionSerializer


class PushSubscriptionCreateView(APIView):
    permission_classes = [IsAdminOrActiveSeller]

    def post(self, request):
        info_endpoint = request.data.get("info_endpoint")

        if not info_endpoint:
            return Response(
                {"error": "info_endpoint is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subscription = PushSubscription.objects.filter(
            user=request.user, endpoint=info_endpoint
        ).first()

        if subscription:
            serializer = PushSubscriptionSerializer(
                subscription,
                data=request.data,
                context={"request": request},
                partial=True,
            )
        else:
            serializer = PushSubscriptionSerializer(
                data=request.data,
                context={"request": request},
            )

        if serializer.is_valid():
            subscription = serializer.save(user=request.user)
            return Response(
                {"success": True, "id": subscription.id}, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
