from ..models import Seller
from ..serializers import SellerSetProfileSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class SellerSetProfileView(APIView):
    """
    Установка профиля продавца по токену и SellerInvite.
    Создает пользователя и объект Seller.
    """

    def post(self, request):
        serializer = SellerSetProfileSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        token = serializer.context["token_instance"]
        invite = serializer.context["invite_instance"]
        user = token.user

        user.set_password(validated_data["password"])
        user.has_password = True

        full_name = validated_data.get("profile_fullname")
        email = validated_data.get("profile_email")

        if full_name:
            user.full_name = full_name
        if email:
            user.email = email

        user.save()

        token.delete()
        invite.mark_used()

        Seller.objects.get_or_create(user=user)

        return Response(
            {
                "success": True,
            },
            status=status.HTTP_200_OK,
        )
