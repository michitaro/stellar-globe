.PHONY: rebuild rebuild-python rebuild-jupyterlab-extension rebuild-dependencies serve rebuild-app setup

setup:
	uv sync --dev

serve: rebuild
	uv run jupyter lite serve

rebuild: rebuild-dependencies
	$(MAKE) build

build:
	mkdir -p pypi files
	cp ../python/dist/hscmap-0.0.0-py3-none-any.whl ./pypi/
	cp ../jupyterlab-extension/tutorial.ipynb ./files/
	uv pip uninstall -y stellar_globe_jupyterlab_extension
	uv pip install ../jupyterlab-extension
	uv run jupyter lite build

rebuild-dependencies: rebuild-python rebuild-jupyterlab-extension

rebuild-app:
	$(MAKE) -C ../../app lib

rebuild-python: rebuild-app
	$(MAKE) -C ../python build

rebuild-jupyterlab-extension: rebuild-app
	$(MAKE) -C ../jupyterlab-extension build

deploy: rebuild
	rsync -av --delete _output/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/jupyter/
