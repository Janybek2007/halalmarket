#!/bin/bash
set -e

# Создаём миграции для пользовательских приложений
if ! make makemigrations -f Makefile.docker ; then
    echo "Makemigrations failed. Check logs for details."
    exit 1
fi

# Выполняем миграции базы данных
if ! make migrate -f Makefile.docker; then
    echo "Migration failed. Check logs for details."
    exit 1
fi

# Создаём индексы для поиска продуктов
if ! make create_search_indexes -f Makefile.docker; then
    echo "Creating search indexes failed. Check logs for details."
    exit 1
fi

# Выполняем collectstatic
if ! make collectstatic -f Makefile.docker; then
    echo "Collectstatic failed. Check logs for details."
    exit 1
fi

exec "$@"
