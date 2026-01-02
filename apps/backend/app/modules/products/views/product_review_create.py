from django.shortcuts import get_object_or_404
from modules.users.permissions import IsTokenAuthenticated
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Product, Review, ReviewImage


class ProductReviewCreateView(APIView):
    permission_classes = [IsTokenAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        product = get_object_or_404(Product, slug=slug)

        review = Review.objects.create(
            user=request.user,
            product=product,
            rating=request.data.get("rating"),
            comment=request.data.get("comment"),
        )

        if "files" in request.FILES:
            files = request.FILES.getlist("files")
            for file in files:
                ReviewImage.objects.create(review=review, image=file)

        if (
            hasattr(product, "store")
            and product.store
            and hasattr(product.store, "seller")
        ):
            seller = product.store.seller
            if seller and hasattr(seller, "id"):
                from ..tasks import send_new_review_notification

                send_new_review_notification.delay(
                    seller_user_id=int(seller.user.id),
                    product_name=product.name,
                    review_id=int(review.id),
                    product_id=int(product.id),
                    review_rating=review.rating,
                    review_text=review.comment or "",
                    user_email=request.user.email,
                )

        from shared.utils.calculate_average_rating import calculate_average_rating

        product_reviews = product.reviews.all()
        ratings = [review.rating for review in product_reviews]
        new_average_rating = calculate_average_rating(ratings)

        return Response(
            {
                "success": True,
                "new_average_rating": new_average_rating,
            },
            status=status.HTTP_201_CREATED,
        )
