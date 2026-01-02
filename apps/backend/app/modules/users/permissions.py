from rest_framework import permissions
from rest_framework.request import Request

from .models import Seller, SellerStatus


class IsTokenAuthenticated(permissions.BasePermission):
    def has_permission(self, request: Request, view):
        return bool(request.user and request.user.is_authenticated)


class IsUser(IsTokenAuthenticated):
    def has_permission(self, request: Request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == "user"


class IsAdmin(IsTokenAuthenticated):
    def has_permission(self, request: Request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == "admin"


class IsActiveSeller(IsTokenAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.user.role != "seller":
            return False

        try:
            seller = Seller.objects.get(user=request.user)
            return seller.status == SellerStatus.ACTIVE
        except Seller.DoesNotExist:
            return False


class IsAdminOrActiveSeller(IsTokenAuthenticated):
    """
    Разрешение, которое проверяет, является ли пользователь либо админом,
    либо зарегистрированным продавцом.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.user.role == "admin":
            return True

        if request.user.role == "seller":
            try:
                seller = Seller.objects.get(user=request.user)
                return seller.status == SellerStatus.ACTIVE
            except Seller.DoesNotExist:
                return False

        return False


class IsUserOrActiveSeller(IsTokenAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.user.role == "user":
            return True

        if request.user.role == "seller":
            try:
                seller = Seller.objects.get(user=request.user)
                return seller.status == SellerStatus.ACTIVE
            except Seller.DoesNotExist:
                return False

        return False
