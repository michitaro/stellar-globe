.PHONY: build-dependencies build-frontend dev setup setup-frontend test

setup:
	uv sync --dev

setup-frontend:
	cd static && npm install

build-dependencies:
	$(MAKE) -C ../../stellar-globe
	$(MAKE) -C ../../react-stellar-globe
	$(MAKE) -C ../../react-draggable-dialog
	$(MAKE) -C ../../app lib

build-frontend: build-dependencies
	cd static && npm install
	cd static && npm run build

dev:
	uv run hscmap-server --host 127.0.0.1 --port 8000

test:
	uv run pytest
