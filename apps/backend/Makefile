# ========================
# Base
# ========================

SHELL := /bin/sh

APP_DIR := app
CD_APP := cd $(APP_DIR)

VENV := .venv

MODULES := users categories products carts orders sellers notifications favorites promotions


# ========================
# OS / Paths
# ========================

ifeq ($(OS),Windows_NT)
	VENV_BIN := ../$(VENV)/Scripts
	VENV_PYTHON := $(VENV_BIN)/python.exe
	VENV_PIP := $(VENV_BIN)/pip.exe
else
	VENV_BIN := ../$(VENV)/bin
	VENV_PYTHON := $(VENV_BIN)/python
	VENV_PIP := $(VENV_BIN)/pip
endif

UVICORN := $(VENV_BIN)/uvicorn
GUNICORN := $(VENV_BIN)/gunicorn
CELERY := $(VENV_BIN)/celery

# ========================
# Detect python / uv
# ========================

ifeq ($(shell command -v python >/dev/null 2>&1 && echo 1),1)
	SYS_PYTHON := python
else ifeq ($(shell command -v python3 >/dev/null 2>&1 && echo 1),1)
	SYS_PYTHON := python3
else
	$(error python / python3 не найден)
endif

UV := uv
HAS_UV := $(shell command -v $(UV) >/dev/null 2>&1 && echo 1 || echo 0)

PYTHON_RUN := $(VENV_PYTHON) manage.py


# ========================
# Bootstrap
# ========================

bootstrap: venv install
	@echo "✔ Проект готов к работе"

venv:
ifeq ($(wildcard $(VENV)),)
	@echo "→ Создаю virtualenv"
	$(SYS_PYTHON) -m venv $(VENV)
else
	@echo "→ virtualenv уже существует"
endif


# ========================
# Dependencies
# ========================

export:
ifeq ($(HAS_UV),1)
	@echo "→ Экспортирую зависимости через uv"
	$(UV) export -o requirements.txt --no-hashes
else
	@echo "uv не найден — export пропущен"
endif

install:
	@echo "→ Обновляю pip"
	$(VENV_PIP) install --upgrade pip
ifeq ($(HAS_UV),1)
	$(MAKE) export
endif
	@echo "→ Устанавливаю зависимости"
	$(VENV_PIP) install --no-cache-dir -r requirements.txt

sync:
ifeq ($(HAS_UV),1)
	$(UV) sync
else
	$(error uv не установлен)
endif


# ========================
# Django
# ========================

run:
	$(CD_APP) && $(PYTHON_RUN) runserver 0.0.0.0:8000

migrate:
	$(CD_APP) && $(PYTHON_RUN) migrate

makemigrations:
	$(CD_APP) && $(PYTHON_RUN) makemigrations $(MODULES)

createsuperuser:
	$(CD_APP) && $(PYTHON_RUN) createsuperuser

collectstatic:
	$(CD_APP) && $(PYTHON_RUN) collectstatic --noinput


# ========================
# ASGI / WSGI через uv
# ========================

runserver_u:
ifeq ($(HAS_UV),1)
	$(CD_APP) ; $(UV) run uvicorn config.asgi:application --host 0.0.0.0 --port 8000
else
	$(CD_APP) && $(UVICORN) config.asgi:application \
		--host 0.0.0.0 \
		--port 8000
endif

runserver_g:
ifeq ($(HAS_UV),1)
	$(CD_APP) ; $(UV) run gunicorn config.wsgi:application \
		--workers 4 \
		--threads 2 \
		--worker-class gthread \
		--timeout 120 \
		--bind 0.0.0.0:8000
else
	$(CD_APP) && $(GUNICORN) config.wsgi:application \
		--workers 4 \
		--threads 2 \
		--worker-class gthread \
		--timeout 120 \
		--bind 0.0.0.0:8000
endif


# ========================
# Celery через uv
# ========================

celeryrun:
ifeq ($(HAS_UV),1)
	$(CD_APP) ; $(UV) run celery -A config.celery worker --loglevel=info --pool=solo
else
	$(CD_APP) && $(CELERY) -A config.celery worker \
		--loglevel=info \
		--pool=solo
endif


# ========================
# Generic command
# ========================

cmd:
	$(CD_APP) ; $(PYTHON_RUN) $(filter-out $@,$(MAKECMDGOALS))


.PHONY: \
	bootstrap venv export install sync \
	run migrate makemigrations createsuperuser collectstatic \
	runserver_u runserver_g celeryrun cmd
