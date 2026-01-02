# ========================
# Base
# ========================

SHELL := /bin/sh
APP_DIR := app
CD_APP := cd $(APP_DIR)

VENV := .venv

MODULES := users categories products carts orders sellers notifications favorites promotions


# ========================
# Detect uv
# ========================

UV := uv
HAS_UV := $(shell command -v $(UV) >/dev/null 2>&1 && echo 1 || echo 0)


# ========================
# Detect python / python3
# ========================

ifeq ($(shell command -v python >/dev/null 2>&1 && echo 1), 1)
	SYS_PYTHON := python
else ifeq ($(shell command -v python3 >/dev/null 2>&1 && echo 1), 1)
	SYS_PYTHON := python3
else
	$(error python или python3 не найден)
endif


# ========================
# venv python / pip
# ========================

ifeq ($(OS),Windows_NT)
	VENV_PYTHON := ../$(VENV)/Scripts/python.exe
	VENV_PIP := ../$(VENV)/Scripts/pip.exe
else
	VENV_PYTHON := ../$(VENV)/bin/python
	VENV_PIP := ../$(VENV)/bin/pip
endif


# ========================
# Django runner
# ========================

ifeq ($(HAS_UV),1)
	PYTHON_RUN := $(UV) run python manage.py
else
	PYTHON_RUN := $(VENV_PYTHON) manage.py
endif


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
	$(CD_APP) ; $(PYTHON_RUN) runserver 0.0.0.0:8000

migrate:
	$(CD_APP) ; $(PYTHON_RUN) migrate

makemigrations:
	$(CD_APP) ; $(PYTHON_RUN) makemigrations $(MODULES)

createsuperuser:
	$(CD_APP) ; $(PYTHON_RUN) createsuperuser

collectstatic:
	$(CD_APP) ; $(PYTHON_RUN) collectstatic --noinput


# ========================
# ASGI / WSGI
# ========================

runserver_u:
ifeq ($(HAS_UV),1)
	$(CD_APP) ; $(UV) run uvicorn config.asgi:application --host 0.0.0.0 --port 8000
else
	$(error uv не установлен)
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
	$(error uv не установлен)
endif


# ========================
# Celery
# ========================

celeryrun:
ifeq ($(HAS_UV),1)
	$(CD_APP) ; $(UV) run celery -A config.celery worker --loglevel=info --pool=solo
else
	$(error uv не установлен)
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
