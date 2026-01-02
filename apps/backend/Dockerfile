FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl netcat-openbsd gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --only main

COPY . .

COPY scripts /scripts
RUN chmod +x /scripts/entrypoint.sh
RUN chmod +x /scripts/generate_vapid.sh

ENTRYPOINT ["/scripts/entrypoint.sh", "/scripts/generate_vapid.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
