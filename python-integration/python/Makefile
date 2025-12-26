.PHONY: setup test test-watch datamodel typecheck typecheck-watch deploy build

build:
	uv build

setup:
	uv sync --dev

test:
	uv run pytest --cov=hscmap --cov-report=html --ff -x -s tests $(pytest_opts)

test-watch:
	uv run ptw --runner "$(MAKE) test"

../../app/jsonschema/public.json:
	$(MAKE) -C ../../app public-jsonschema

datamodel: ../../app/jsonschema/public.json
	uv run python -m devel.gendatamodel

typecheck:
	uv run pyright

typecheck-watch:
	uv run pyright --watch

deploy: build
	ssh hscmap.mtk.nao.ac.jp mkdir -p htdocs/hscMap5/python/dist
	rsync -av ./dist/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/python/dist
