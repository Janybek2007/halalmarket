from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from modules.sellers.models import Seller
from modules.users.permissions import IsAdmin


class AdminSellersDeleteView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [JSONParser]

    def delete(self, request):
        data = request.data
        ids_raw = data.get("ids")

        if not ids_raw:
            return Response({"error": "Поле 'ids' обязательно"}, status=400)

        if isinstance(ids_raw, str):
            seller_ids = [i.strip() for i in ids_raw.split(",") if i.strip()]
        elif isinstance(ids_raw, list):
            seller_ids = ids_raw
        else:
            return Response(
                {"error": "'ids' должен быть строкой или списком"}, status=400
            )

        if not seller_ids:
            return Response({"error": "'ids' должен быть непустым"}, status=400)

        results = {"success": True, "deleted": [], "not_found": []}

        for seller_id in seller_ids:
            try:
                seller = Seller.objects.get(id=int(seller_id))
                self._delete_seller(seller)
                results["deleted"].append(int(seller_id))
            except Seller.DoesNotExist:
                results["not_found"].append(int(seller_id))

        return Response(results)

    def _delete_seller(self, seller):
        user = seller.user

        if user:
            from ..tasks import send_seller_deleted_notification

            send_seller_deleted_notification.delay(
                user_id=int(user.id),
                user_email=user.email,
            )

        seller.delete()
        if user:
            user.delete()
