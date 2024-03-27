.PHONY: rebuild rebuild-python rebuild-jupyterlab-extension rebuild-dependencies serve rebuild-app

python_home := .venv

serve: rebuild
	$(python_home)/bin/jupyter lite serve

rebuild: rebuild-dependencies
	cp ../jupyterlab-extension/tutorial.ipynb ./files/
	$(python_home)/bin/jupyter lite build

rebuild-dependencies: rebuild-python rebuild-jupyterlab-extension

rebuild-app:
	$(MAKE) -C ../../app build

rebuild-python: rebuild-app
	$(MAKE) -C ../python build
	cp ../python/dist/hscmap-0.0.0-py3-none-any.whl ./pypi/

rebuild-jupyterlab-extension: rebuild-app
	$(MAKE) -C ../jupyterlab-extension build
	$(python_home)/bin/pip uninstall -y stellar_globe_jupyterlab_extension
	$(python_home)/bin/pip install ../jupyterlab-extension

deploy:
	rsync -av --delete _output/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/jupyter/