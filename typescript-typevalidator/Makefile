.PHONE: build setup

python_home := ./.venv
miniconda3_python = ~/miniconda3/envs/py3_12/bin/python

build: node_modules
	npm run build

install_vnev:
	$(miniconda3_python) -m venv .venv

node_modules: package.json package-lock.json
	npm install

setup:
	$(python_home)/bin/pip install -U pip
	$(python_home)/bin/pip install -e .
	$(python_home)/bin/pip install -e '.[dev]'
