.PHONE: test test-watch

test:
	pytest --cov=hscmap --cov-report=html --ff -x -s tests

test-watch:
	ptw --runner "$(MAKE) test"