## Bootstrap

```bash
~/miniconda3/envs/py3_11/bin/python -m venv ./.venv
source ./.venv/bin/activate
pip install -U pip
pip install copier jupyterlab jinja2_time
copier copy https://github.com/jupyterlab/extension-template . --trust \
  --force \
  -d kind=frontend \
  -d author_name='Michitaro Koike' \
  -d author_email='' \
  -d labextension_name='jupyterlab-stellar-globe' \
  -d python_name=stellarglobe \
  -d project_short_description='' \
  -d has_settings=no \
  -d has_binder=no \
  -d test=yes \
  -d repository=''
```

```patch
diff --git a/jupyterlab/package.json b/jupyterlab/package.json
index 4fddf00..febdbed 100644
--- a/jupyterlab/package.json
+++ b/jupyterlab/package.json
@@ -52,7 +52,9 @@
         "watch:labextension": "jupyter labextension watch ."
     },
     "dependencies": {
-        "@jupyterlab/application": "^4.0.0"
+        "@jupyterlab/application": "^4.0.0",
+        "@stellar-globe/react-stellar-globe": "link:../react-stellar-globe",
+        "@stellar-globe/stellar-globe": "link:../stellar-globe"
     },
     "devDependencies": {
         "@jupyterlab/builder": "^4.0.0",
```

```bash
jlpm run refresh-type-validators
```

```bash
python -m venv ./.venv-jsonschema
./.venv-jsonschema/bin/pip install -U pip
./.venv-jsonschema/bin/pip install 'datamodel-code-generator==0.22.1'
python -m stellarglobe.devel.generatemodels
```

```bash
pip install -ve .
jupyter labextension develop --overwrite .
jupyter lab
```
```bash
# in another terminal
jlpm run watch
```
