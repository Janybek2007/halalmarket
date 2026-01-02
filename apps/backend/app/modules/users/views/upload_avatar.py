from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsTokenAuthenticated


class UploadAvatarView(APIView):
    permission_classes = [IsTokenAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if "file" not in request.FILES:
            return Response(
                {"error": "Файл не был загружен"}, status=status.HTTP_400_BAD_REQUEST
            )

        file = request.FILES["file"]
        user = request.user
        user.avatar = file
        user.save()

        return Response({"success": True}, status=status.HTTP_200_OK)
