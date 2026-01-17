.PHONY: run install build start

run:
	npm run dev

install:
	bun install

build:
	npm run build

start:
	node .next\standalone\server.js

copy_sp: # static/public
ifeq ($(OS),Windows_NT)
	xcopy /E /I /Y public .next\standalone\public
	xcopy /E /I /Y .next\static .next\standalone\.next\static
else
	cp -r public .next/standalone/public
	cp -r .next/static .next/standalone/.next/static
endif
