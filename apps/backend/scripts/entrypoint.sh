#!/bin/bash
set -e

# Ждем, пока PostgreSQL станет доступен (максимум 15 попыток)
echo "Waiting for PostgreSQL..."
postgres_tries=0
until nc -z -v -w30 postgres 5432
do
  postgres_tries=$((postgres_tries+1))
  if [ $postgres_tries -ge 15 ]; then
    echo "PostgreSQL connection failed after 15 attempts."
    exit 1
  fi
  echo "Waiting for PostgreSQL connection... ($postgres_tries/15)"
  sleep 5
done
echo "PostgreSQL is up!"

# Создаём миграции для пользовательских приложений
if ! python manage.py makemigrations accounts categories products carts orders sellers notifications favorites analytics promotions wa; then
    echo "Makemigrations failed. Check logs for details."
    exit 1
fi

# Выполняем миграции базы данных
if ! python manage.py migrate; then
    echo "Migration failed. Check logs for details."
    exit 1
fi

# Создаём индексы для поиска продуктов
if ! python manage.py create_search_indexes; then
    echo "Creating search indexes failed. Check logs for details."
    exit 1
fi

# Выполняем collectstatic
if ! python manage.py collectstatic --noinput; then
    echo "Collectstatic failed. Check logs for details."
    exit 1
fi

exec "$@"
