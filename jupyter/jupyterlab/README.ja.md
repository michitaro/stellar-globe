## 開発準備

```bash
~/miniconda3/envs/py3_11/bin/python -m venv ./.venv
source ./.venv/bin/activate

pip install -U pip
pip install ".[dev]"
pip install -e "."
jupyter labextension develop --overwrite .

node ./node_modules/@stellar-globe/typescript-typevalidator/dist/cli.js -o ./src/typevalidator -t PythonToFrontendTypeValidatorJsonSchema

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

## Deploy

```
jlpm run build
pip install .
```

実行環境で`jlpm run build`は行う必要はない。
例えば`Dockerfile`内ではビルド用ステージで`jlpm run build`を行えばよく、その結果を実行用ステージにコピーし`pip install .`すればよい。

## メモ

現状はJupyterからhscMapを使うための構成だが、
`hscmap`モジュールは`comm`のバックエンドを変えることでJupyterを通さずにhscMapと通信することも考えられる。
通信は次のようになされる。

```
hscmap(python) -> comm -> jupyter -> hscMap(frontend)
                       -> mockcomm
                       -> fastapi -> hscMap(frontend)
```
