.PHONY: build deploy setup wheel clean

setup:
	uv sync --dev

build:
	bash -c 'source ./.venv/bin/activate && jlpm build'

# 配布用.whlファイルを作成（dist/に出力される）
wheel: build
	bash -c 'source ./.venv/bin/activate && python -m build --wheel'

clean:
	rm -rf dist/ build/ *.egg-info stellar_globe_jupyterlab_extension/labextension/

deploy: wheel
	chmod 644 ./dist/*.whl
	ssh hscmap.mtk.nao.ac.jp mkdir -p htdocs/hscMap5/python/dist
	rsync -av ./dist/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/python/dist
