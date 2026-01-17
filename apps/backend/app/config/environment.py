import os
import re
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def extract_host_from_url(url):
    host = re.sub(r"^https?://", "", url.strip())
    host = host.split(":", 1)[0].split("/", 1)[0]
    return host


__ENV = {
    # General settings
    "MODE": os.getenv("MODE", "development"),
    "DEBUG": os.getenv("DEBUG", "False") == "True",
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    # CORS and Hosts
    "ALLOWED_ORIGINS": [
        host.strip() for host in os.getenv("ALLOWED_ORIGINS", "").split(",")
    ],
    # Database settings
    "DB_NAME": os.getenv("POSTGRES_DB"),
    "DB_USER": os.getenv("POSTGRES_USER"),
    "DB_PASSWORD": os.getenv("POSTGRES_PASSWORD"),
    "DB_HOST": os.getenv("POSTGRES_HOST"),
    # Redis settings
    "REDIS_HOST": os.getenv("REDIS_HOST"),
    "REDIS_PASSWORD": os.getenv("REDIS_PASSWORD"),
    # URLs
    "CLIENT_URL": os.getenv("CLIENT_URL"),
    "API_URL": os.getenv("API_URL"),
    # Email settings
    "DEFAULT_FROM_EMAIL": os.getenv("DEFAULT_FROM_EMAIL"),
    "EMAIL_HOST_USER": os.getenv("EMAIL_HOST_USER"),
    "EMAIL_HOST_PASSWORD": os.getenv("EMAIL_HOST_PASSWORD"),
    # WebPush settings
    "WEBPUSH_SETTINGS": {
        "VAPID_PRIVATE_KEY": os.getenv("VAPID_PRIVATE_KEY"),
        "VAPID_ADMIN_EMAIL": os.getenv("VAPID_ADMIN_EMAIL"),
    },
}
