from django.conf import settings
from django.utils import timezone
from modules.sellers.models import SellerInvite
from modules.users.models import User
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.utils.phone_validator import validate_phone_format
from shared.utils.token import generate_seller_set_profile_token


class AdminSellerInviteView(APIView):

    def post(self, request):
        phone = request.data.get("phone")
        email = request.data.get("email")

        if not phone:
            return Response(
                {"error": "Требуется номер телефона"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            clean_phone = validate_phone_format(phone)
        except ValidationError as e:
            error_msg = e.detail[0] if isinstance(e.detail, list) else str(e.detail)
            return Response({"error": str(error_msg)}, status=400)

        if User.objects.filter(phone=phone).exists():
            return Response(
                {"error": "Пользователь с таким номером телефона уже зарегистрирован"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Пользователь с таким email уже зарегистрирован"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        clean_phone = phone.replace(" ", "")
        if not email:
            email = f"{clean_phone}@halalmarket.kg"

        user = User.objects.create(
            full_name=f"{clean_phone}",
            phone=phone,
            email=email,
            role="seller",
        )

        token = generate_seller_set_profile_token(user)

        invite = SellerInvite.objects.create(
            phone=phone,
            token=token,
            expires_at=timezone.now() + timezone.timedelta(days=3),
            invited_by=request.user,
        )

        client_url = getattr(settings, "CLIENT_URL")
        invite_url = f"{client_url}/seller/set-profile?token={invite.token}"

        from modules.sellers.tasks import send_seller_invite_notification

        send_seller_invite_notification.delay(
            user_id=int(user.id),
            invite_url=invite_url,
            seller_name=user.full_name,
            seller_phone=user.phone,
        )

        return Response(
            {
                "success": True,
                "invite_url": invite_url,
                "expires_at": invite.expires_at,
                "email_sent": bool(email),
            },
            status=status.HTTP_200_OK,
        )
