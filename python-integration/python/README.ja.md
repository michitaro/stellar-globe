# Python Integration - hscmap/stellarglobe

Python環境からStellar Globe (hscMap) アプリケーションを操作するためのクライアントライブラリです。

## 目的

* Python（特にJupyter環境）からhscMapを制御
* 型安全な通信の実現
* データ可視化と解析の連携

## インストール

```bash
pip install hscmap
```

または開発版：

```bash
git clone <repository>
cd python-integration/python
make setup
```

## パッケージ構成

### `src/hscmap/`
メインパッケージディレクトリ。hscMapとの通信機能を提供します。

主要なモジュール：
* `window.py`: ウィンドウ（ビューワーインスタンス）の管理
* `comm.py`: Jupyter Comm通信の実装
* `types.py`: 型定義
* `validators.py`: メッセージ検証

### `src/stellarglobe/`
汎用的な天文計算・ユーティリティ（将来的な拡張用）

### `tests/`
pytest によるテストコード

### `docs/`
Sphinx によるドキュメントソース

## app との連携のための型チェック機構

Python側とTypeScript側（app）で型の整合性を保つため、以下の仕組みを実装しています。

### 仕組み

1. **共通のJSON Schema**: `app` 側で生成されたJSON Schemaを使用
   * `app/jsonschema/public.json` をPython側で読み込み
   
2. **データモデルの自動生成**: 
   `app/jsonschema/public.json` から Python の型ヒント付きデータクラスを自動生成します。
   生成には `datamodel-code-generator` ライブラリを使用しており、
   JSON SchemaからPydanticベースのデータクラスを生成します。
   ```bash
   make datamodel
   ```
   このコマンドにより、`src/hscmap/generated_types.py` が生成されます。

3. **実行時検証**: 
   `jsonschema` ライブラリを使用して送受信メッセージを検証します。
   * Python→app: メッセージ送信前に `validators.py` で検証
   * app→Python: メッセージ受信時に検証
   
   検証は `jsonschema.validate()` 関数を使用し、JSON Schema仕様に準拠した厳密なチェックを行います。

### app 側の型チェック

app側では `ajv` ライブラリ（Another JSON Schema Validator）を使用して、
同じJSON Schemaに基づいた実行時検証を行います。
詳細は `app/README.ja.md` を参照してください。

### 型の整合性を保つ手順

1. `app/types/commTools/index.d.ts` で型を更新
2. `app` で `npm run refresh-types` を実行してJSON Schemaを再生成
3. `python-integration/python` で `make datamodel` を実行してPython型を再生成
4. Python側のコードを更新して新しい型を使用

## テスト

このプロジェクトでは `pytest` を使用してテストを実行します。
テストは `tests/` ディレクトリ配下にあり、カバレッジレポートも生成されます。

### テストの実行

基本的なテスト実行（開発環境のセットアップ後）：
```bash
make test
```

これは以下のコマンドと等価です：
```bash
pytest --cov=hscmap --cov-report=html --ff -x -s tests
```

オプションの説明：
* `--cov=hscmap`: `hscmap` パッケージのカバレッジを測定
* `--cov-report=html`: HTMLレポートを `htmlcov/` に生成
* `--ff`: 前回失敗したテストを最初に実行
* `-x`: 最初の失敗で停止
* `-s`: print文の出力を表示

### ウォッチモード

ファイルの変更を監視して自動的にテストを再実行：
```bash
make test-watch
```

### テストマーカー

`pytest.ini` でテストマーカーが定義されています：
* `slow`: 実行に時間がかかるテスト（デフォルトでスキップされます）
* `hot`: 開発中のテスト

slowマーク付きテストも実行する場合：
```bash
pytest -m "" tests
```

特定のマーカーのみ実行：
```bash
pytest -m "hot" tests
```

### カバレッジレポート

テスト実行後、`htmlcov/index.html` をブラウザで開くことで、
視覚的にカバレッジを確認できます。

## 開発ツール

### 開発環境のセットアップ

仮想環境の作成と依存パッケージのインストールを行います：
```bash
make setup
```

このコマンドは以下を実行します：
1. `.venv` ディレクトリに仮想環境を作成
2. pip を最新版に更新
3. 本パッケージを開発モード（`-e`）でインストール
4. 開発用依存パッケージ（pytest、pyright など）をインストール

### 型チェック

Pyright を使用した静的型チェックを実行します：
```bash
make typecheck
```

ウォッチモードでファイル変更を監視：
```bash
make typecheck-watch
```

Pyrightは Microsoft が開発した高速なPython型チェッカーで、
`pyrightconfig.json` で設定されています。

### データモデルの生成

`app/jsonschema/public.json` からPythonのデータモデルを自動生成します：
```bash
make datamodel
```

このコマンドは：
1. 必要に応じて `app` ディレクトリで JSON Schema を生成
2. `datamodel-code-generator` を実行して型ヒント付きクラスを生成
3. 生成されたコードを `src/hscmap/generated_types.py` に配置

### ビルド

配布用パッケージ（wheel と tar.gz）をビルドします：
```bash
make build
```

生成されたパッケージは `dist/` ディレクトリに配置されます。

### デプロイ

ビルドしたパッケージをデプロイサーバーにアップロードします：
```bash
make deploy
```

これにより `hscmap.mtk.nao.ac.jp` サーバーにパッケージがアップロードされます。

## デプロイ先

`https://hscmap.mtk.nao.ac.jp/hscMap5/` 以下に以下のファイルが配置されます：

* `app/`: HSC Mapアプリケーション本体
* `jupyter/`: JupyterLab拡張機能
* `python/`: Pythonパッケージ
  * `notebooks/`: チュートリアルノートブック
  * `docs/`: Sphinxドキュメント
  * `dist/`: 配布パッケージ
