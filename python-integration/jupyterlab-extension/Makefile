.PHONY: build deploy setup

setup:
	uv sync --dev

build:
	bash -c 'source ./.venv/bin/activate && jlpm build'

deploy: build
	chmod 644 ./dist/*.tar.gz
	ssh hscmap.mtk.nao.ac.jp mkdir -p htdocs/hscMap5/python/dist
	rsync -av ./dist/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/python/dist
