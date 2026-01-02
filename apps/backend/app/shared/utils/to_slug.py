from slugify import slugify
from transliterate import translit


def toSlug(text, default="category"):
    """
    Generate an English slug from text, transliterating Cyrillic to Latin.

    Args:
        text (str): The text to slugify (e.g., "БАД и витамины").

    Returns:
        str: An ASCII slug (e.g., "bad-i-vitaminy").
    """
    try:
        text_translit = translit(text, "ru", reversed=True)
    except Exception:
        text_translit = text

    slug = slugify(text_translit, allow_unicode=False)
    if not slug:
        slug = default

    return slug
