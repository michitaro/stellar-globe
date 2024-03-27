.PHONY: all lib standalone toapp-typevalidator action-typevalidator persistent-typevalidator deploy public-jsonschema

all: standalone lib

lib: toapp-typevalidator action-typevalidator persistent-typevalidator
	npm run build-lib

standalone: persistent-typevalidator
	npm run build-standalone

toapp-typevalidator:
	npm run make-toapp-typevalidator

action-typevalidator:
	npm run make-action-typevalidator

persistent-typevalidator:
	npm run make-persistent-typevalidator

deploy: standalone
	rsync -av --delete ./dist/standalone/ hscmap.mtk.nao.ac.jp:htdocs/hscMap5/app/

# This is for Python module
public-jsonschema:
	npm run make-public-json-schema
