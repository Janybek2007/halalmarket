# ========================
# Base
# ========================

SHELL := /bin/sh

APP_DIR := app
SET_PYTHONPATH := PYTHONPATH=$(APP_DIR)

VENV := .venv

MODULES := users categories products carts orders sellers notifications favorites promotions


# ========================
# OS / Paths
# ========================

ifeq ($(OS),Windows_NT)
	VENV_BIN := $(VENV)/Scripts
else
	VENV_BIN := $(VENV)/bin
endif

VENV_PYTHON := $(VENV_BIN)/python
VENV_PIP := $(VENV_BIN)/pip

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

PYTHON_RUN := $(SET_PYTHONPATH) $(VENV_PYTHON) $(APP_DIR)/manage.py


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
	$(PYTHON_RUN) runserver 0.0.0.0:8000

migrate:
	$(PYTHON_RUN) migrate

makemigrations:
	$(PYTHON_RUN) makemigrations $(MODULES)

createsuperuser:
	$(PYTHON_RUN) createsuperuser

collectstatic:
	$(PYTHON_RUN) collectstatic --noinput

check:
	$(PYTHON_RUN) check


# ========================
# ASGI / WSGI
# ========================

runserver_u:
	$(SET_PYTHONPATH) $(UVICORN) app.config.asgi:application \
		--host 0.0.0.0 \
		--port 8000

runserver_g:
	$(SET_PYTHONPATH) $(GUNICORN) app.config.wsgi:application \
		--workers 4 \
		--threads 2 \
		--worker-class gthread \
		--timeout 120 \
		--bind 0.0.0.0:8000


# ========================
# Celery
# ========================

celeryrun:
	$(SET_PYTHONPATH) $(CELERY) -A app.config.celery worker \
		--loglevel=info \
		--pool=solo


# ========================
# Generic command
# ========================

cmd:
	$(PYTHON_RUN) $(filter-out $@,$(MAKECMDGOALS))


.PHONY: \
	bootstrap venv export install sync \
	run migrate makemigrations createsuperuser collectstatic check \
	runserver_u runserver_g celeryrun cmd
