.PHONY: dev setup test

setup:
	uv sync --dev

dev:
	uv run uvicorn hscmapserver:app --reload

test:
	uv run pytest