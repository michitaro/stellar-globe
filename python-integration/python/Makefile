python_home := ./.venv
python = ~/miniconda3/envs/py3_12/bin/python

.PHONE: setup test test-watch datamodel typecheck typecheck-watch

setup:
	$(python) -m venv $(python_home)
	$(python_home)/bin/pip install -U pip
	$(python_home)/bin/pip install -e .
	$(python_home)/bin/pip install -e '.[dev]'

test:
	$(python_home)/bin/pytest --cov=hscmap --cov-report=html --ff -x -s tests $(pytest_opts)

test-watch:
	$(python_home)/bin/ptw --runner "$(MAKE) test"

datamodel:
	$(python_home)/bin/python -m devel.gendatamodel

typecheck:
	./node_modules/.bin/pyright --pythonpath $(python_home)/bin/python ./src/hscmap

typecheck-watch:
	./node_modules/.bin/pyright --watch --pythonpath $(python_home)/bin/python ./src/hscmap