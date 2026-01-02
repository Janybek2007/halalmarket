import re

from rest_framework.exceptions import ValidationError

PHONE_ERROR_MESSAGE = "Телефон должен быть в формате 996 xxx xxx xxx"
PHONE_PATTERN = r"^(\d{3})\s*(\d{3})\s*(\d{3})\s*(\d{3})$"


def validate_phone_format(phone):
    """Проверяет и форматирует номер телефона

    Args:
        phone (str): Номер телефона для проверки

    Returns:
        str: Отформатированный номер телефона

    Raises:
        ValidationError: Если номер не соответствует формату
    """
    pattern = re.compile(PHONE_PATTERN)
    match = pattern.match(phone)

    if not match:
        raise ValidationError(PHONE_ERROR_MESSAGE)

    return f"{match.group(1)} {match.group(2)} {match.group(3)} {match.group(4)}"
