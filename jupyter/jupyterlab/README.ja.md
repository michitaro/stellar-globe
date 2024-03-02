## 開発準備

```bash
~/miniconda3/envs/py3_11/bin/python -m venv ./.venv
source ./.venv/bin/activate

pip install -U pip
pip install ".[dev]"
pip install -e "."
jupyter labextension develop --overwrite .

jlpm run make-type-validators
python -m devel.dendatamodel

jlpm run build
jupyter lab
# または
jlpm run watch &
jupyter lab
```

### サンプル用パッケージインストール

```bash
pip install '.[for-example]'
```
