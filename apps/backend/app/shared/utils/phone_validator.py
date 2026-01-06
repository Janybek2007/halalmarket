import re

from rest_framework.exceptions import ValidationError

PHONE_ERROR_MESSAGE = "Телефон должен содержать 12 цифр и начинаться с 996"


def validate_phone_format(phone: str) -> str:
    # Удаляем всё, кроме цифр
    digits_only = re.sub(r"\D", "", phone)

    # Проверяем формат
    if not re.fullmatch(r"996\d{9}", digits_only):
        raise ValidationError(PHONE_ERROR_MESSAGE)

    # Возвращаем очищенный номер
    return digits_only
