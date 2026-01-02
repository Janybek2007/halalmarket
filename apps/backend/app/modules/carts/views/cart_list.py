from modules.users.permissions import IsUser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Cart
from ..serializers import CartSerializer

class CartListView(APIView):
    permission_classes = [IsUser]
    schema = None

    def get(self, request):
        carts = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data)
