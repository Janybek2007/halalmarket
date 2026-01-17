# Руководство по установке и запуску приложения Halal Market

Данный документ предоставляет пошаговое руководство по установке и запуску веб-приложения _Halal Market_, состоящего из бэкенда на Django и фронтенда на React. Приложение использует PostgreSQL, Redis, Nginx и systemd для управления сервисами. Инструкции представлены в виде прямых команд для терминала.

## Предварительные требования

- Система на базе Linux (например, Ubuntu 22.04 LTS).
- Доступ с правами root или sudo для установки зависимостей и управления сервисами.
- Подключение к интернету для загрузки зависимостей.
- Установленный Git (`sudo apt install git`) для клонирования репозитория.
- Доступ к репозиторию GitHub/GitLab.

## Шаг 1: Установка системных зависимостей

Установите необходимые системные зависимости, включая Python, Poetry, Node.js, PostgreSQL, Redis, Nginx и другие инструменты.

### Команды: Установка зависимостей

```bash
# Обновление списка пакетов
sudo apt update

# Установка необходимых пакетов
sudo apt install -y curl unzip wget gnupg apt-transport-https make netcat-openbsd gcc libpq-dev

# Установка зависимостей для Python
sudo apt install -y python3-venv python3-pip

# Установка PostgreSQL
if ! command -v psql &> /dev/null; then
  sudo apt install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_postgres_password';"
  sudo -u postgres psql -c "CREATE DATABASE halalmarket;"
  PG_HBA_CONF="/etc/postgresql/*/main/pg_hba.conf"
  sudo sed -i 's/peer/md5/' $PG_HBA_CONF
  sudo sed -i 's/scram-sha-256/md5/' $PG_HBA_CONF
  sudo systemctl restart postgresql
fi

# Установка Redis
if ! command -v redis-server &> /dev/null; then
  sudo apt install -y redis-server
  sudo sed -i 's/# requirepass foobared/requirepass your_redis_password/' /etc/redis/redis.conf
  sudo systemctl enable redis-server
  sudo systemctl restart redis-server
fi

# Установка Nginx
if ! command -v nginx &> /dev/null; then
  sudo apt install -y nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx
fi

# Установка fnm (Fast Node Manager)
if ! command -v fnm &> /dev/null; then
  curl -fsSL https://fnm.vercel.app/install | bash
  source ~/.bashrc
  eval "$(fnm env)"
fi

# Установка Node.js 22 через fnm
fnm install 24
fnm default 24

# Создание символических ссылок для Node.js
sudo ln -sf ~/.local/share/fnm/aliases/default/bin/node /usr/bin/node
sudo ln -sf ~/.local/share/fnm/aliases/default/bin/npm /usr/bin/npm

# Установка bun
if ! command -v bun &> /dev/null; then
  curl -fsSL https://bun.sh/install | bash
  source ~/.bashrc
fi
```

## Шаг 2: Клонирование проекта и настройка переменных окружения

Склонируйте проект Halal Market с GitHub/GitLab, настройте каталоги и создайте файлы переменных окружения.

### Команды: Клонирование и настройка окружения

```bash
# Создание каталога /www и установка разрешений
sudo mkdir -p /www
sudo chown -R $USER:$USER /www
sudo chmod -R 755 /www

# Клонирование репозитория
cd /www
git clone git@github.com:Janybek2007/halalmarket.git .

# Создание .env для фронтенда
cd /www/apps/frontend
cp .env.example .env

# Создание защищённого .env для бэкенда
cd /www/apps/backend
cp .env.example .env

# Создание защищённого .env для image-server
cd /www/apps/image-server
cp .env.example .env
```

## Шаг 3: Настройка бэкенда

Настройте и запустите бэкенд на Django, включая установку зависимостей, миграции и сбор статических файлов.

### Команды: Настройка бэкенда

```bash
# Переход в каталог бэкенда
cd /www/apps/backend

# Установка .venv
make bootstrap

# Создание каталога /data
sudo mkdir -p /data
sudo chown -R $USER:$USER /data
sudo chmod -R 775 /data

# Создание и применение миграций
make makemigrations || { echo "Ошибка создания миграций.";  }
make migrate || { echo "Ошибка применения миграций.";  }
make create_search_indexes || { echo "Ошибка при индексов" }

# Сбор статических файлов
make collectstatic || { echo "Ошибка сбора статических файлов.";  }
```

## Шаг 4: Сборка фронтенда

Соберите фронтенд на React с использованием bun.

## Шаг 5: Настройка image-server

Image-server - это сервис для обработки и доставки изображений с поддержкой кэширования и изменения размеров.

### Команды: Настройка image-server

```bash
# Переход в каталог image-server
cd /www/apps/image-server

# Установка зависимостей
bun install
```

Image-server работает на порту 3030 и предоставляет следующие возможности:

- Обслуживание изображений из директории /data/media
- Поддержка изменения размеров изображений через параметры запроса (?w=ширина&h=высота&q=качество)
- Кэширование обработанных изображений
- Автоматическая конвертация в формат WebP
- Оптимизация изображений с помощью sharp

## Шаг 7: Сборка фронтенда

### Команды: Сборка фронтенда

```bash
# Переход в каталог фронтенда
cd /www/apps/frontend

# Сборка фронтенда
if command -v bun &> /dev/null; then
  make install && make build && make copy_sp || { echo "Ошибка сборки фронтенда.";  }
else
  echo "Ошибка: bun не установлен!"
  exit 1
fi
```

## Шаг 8: Настройка systemd-сервисов

Настройте systemd-сервисы для автоматического запуска бэкенда, фронтенда и Celery.

### Команды: Инициализация systemd-сервисов

```bash
# Переход в корневой каталог
cd /www

# Создание сервиса для бэкенда
sudo tee /etc/systemd/system/halalmarket-backend.service > /dev/null <<EOF
[Unit]
Description=Halal Market Django Backend
After=network.target postgresql.service redis.service
Requires=postgresql.service redis.service

[Service]
WorkingDirectory=/www/apps/backend
ExecStart=/bin/bash -c '/usr/bin/make runserver_u'
User=$USER
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Создание сервиса для Celery
sudo tee /etc/systemd/system/halalmarket-celery.service > /dev/null <<EOF
[Unit]
Description=Halal Market Celery Worker
After=network.target postgresql.service redis.service
Requires=postgresql.service redis.service

[Service]
WorkingDirectory=/www/apps/backend
ExecStart=/bin/bash -c '/usr/bin/make celeryrun'
User=$USER
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Создание сервиса для фронтенда
sudo tee /etc/systemd/system/halalmarket-frontend.service > /dev/null <<EOF
[Unit]
Description=Halal Market Frontend
After=network.target

[Service]
WorkingDirectory=/www/apps/frontend
ExecStart=/usr/bin/npm run start
User=$USER
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Создание сервиса для image-server
sudo tee /etc/systemd/system/halalmarket-image-server.service > /dev/null <<EOF
[Unit]
Description=Halal Market Image Server
After=network.target
Requires=network.target

[Service]
WorkingDirectory=/www/apps/image-server
ExecStartPre=/usr/bin/make build
ExecStart=/usr/bin/make start
User=$USER
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

## Шаг 6: Настройка и запуск Nginx

Настройте Nginx с SSL и перезапустите сервисы.

### Команды: Настройка Nginx

```bash
# Установка certbot для SSL
sudo apt install -y certbot
sudo systemctl stop nginx.service
sudo certbot certonly --standalone -d halalmarket.kg -d www.halalmarket.kg --agree-tos -m {email}

# Откройте файл `/etc/nginx/nginx.conf` для редактирования:
sudo nano /etc/nginx/nginx.conf
# После include /etc/nginx/sites-enabled/*; добавьте 'include /www/nginx/nginx-ssl.conf;'

# Удаление конфигурации по умолчанию
sudo rm -f /etc/nginx/sites-enabled/default

# Перезагрузка и запуск сервисов
sudo systemctl daemon-reload
sudo systemctl enable halalmarket-backend.service
sudo systemctl restart halalmarket-backend.service
sudo systemctl enable halalmarket-celery.service
sudo systemctl restart halalmarket-celery.service
sudo systemctl enable halalmarket-frontend.service
sudo systemctl restart halalmarket-frontend.service
sudo systemctl enable halalmarket-image-server.service
sudo systemctl restart halalmarket-image-server.service
sudo systemctl enable nginx.service
sudo systemctl restart nginx.service
```

## Шаг 7: Резервное копирование

Создайте резервную копию базы данных.

### Команды: Создание бэкапа

```bash
# Создание каталога для бэкапов
sudo mkdir -p /data/pg_backups
sudo chown postgres:postgres /data/pg_backups

# Создание бэкапа
sudo -u postgres pg_dump -U postgres -h localhost halalmarket | sudo tee /data/pg_backups/backup_$(date +%F_%H-%M-%S).sql > /dev/null
```
