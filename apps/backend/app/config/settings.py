from datetime import timedelta
from pathlib import Path

from .environment import __ENV

BASE_DIR = Path(__file__).resolve().parent.parent

# Основные настройки
SECRET_KEY = __ENV["SECRET_KEY"]
DEBUG = __ENV["DEBUG"]
ALLOWED_HOSTS = __ENV["ALLOWED_HOSTS"]

CLIENT_URL = __ENV["CLIENT_URL"]
API_URL = __ENV["API_URL"]

# Приложения
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    # Modules
    "modules.users",
    "modules.categories",
    "modules.products",
    "modules.carts",
    "modules.orders",
    "modules.sellers",
    "modules.admin_api",
    "modules.notifications",
    "modules.favorites",
    "modules.promotions",
]

# Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Templates
ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# База данных
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": __ENV["DB_NAME"],
        "USER": __ENV["DB_USER"],
        "PASSWORD": __ENV["DB_PASSWORD"],
        "HOST": __ENV["DB_HOST"],
        "PORT": 5432,
    }
}

# Статические и медиа файлы
STATIC_URL = "/staticfiles/"
MEDIA_URL = "/media/"
STATIC_ROOT = BASE_DIR / "static" if __ENV["MODE"] == "local" else "/app/staticfiles"
MEDIA_ROOT = BASE_DIR / "media" if __ENV["MODE"] == "local" else "/app/media"

# FORCE_SCRIPT_NAME = "/~"

# Язык и время
LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "Asia/Bishkek"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

AUTHENTICATION_BACKENDS = [
    "modules.users.authentication.EmailPhoneModelBackend",
    "django.contrib.auth.backends.ModelBackend",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "modules.users.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

# JWT настройки
ACCESS_TOKEN_LIFETIME = timedelta(days=2)
REFRESH_TOKEN_LIFETIME = timedelta(days=14)

SESSION_COOKIE_SECURE = __ENV["MODE"] == "production"
CSRF_COOKIE_SECURE = __ENV["MODE"] == "production"
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"

# CSRF
CSRF_TRUSTED_ORIGINS = __ENV["ALLOWED_ORIGINS"]

# CORS настройки
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = __ENV["ALLOWED_ORIGINS"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
CORS_EXPOSE_HEADERS = []

# Email настройки для Gmail SMTP
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = __ENV["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = __ENV["EMAIL_HOST_PASSWORD"]
DEFAULT_FROM_EMAIL = (
    f"{__ENV.get("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER)} <{EMAIL_HOST_USER}>"
)

CELERY_BROKER_URL = f'redis://:{__ENV["REDIS_PASSWORD"]}@{__ENV["REDIS_HOST"]}:6379/0'
CELERY_RESULT_BACKEND = (
    f'redis://:{__ENV["REDIS_PASSWORD"]}@{__ENV["REDIS_HOST"]}:6379/1'
)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE

# Web Push API settings
WEBPUSH_SETTINGS = __ENV["WEBPUSH_SETTINGS"]
