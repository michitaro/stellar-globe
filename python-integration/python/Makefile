.PHONE: test test-watch datamodel

test:
	pytest --cov=hscmap --cov-report=html --ff -x -s tests

test-watch:
	ptw --runner "$(MAKE) test"

datamodel:
	python -m devel.gendatamodel