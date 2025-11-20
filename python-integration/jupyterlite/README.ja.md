# JupyterLite Build

JupyterLiteを使用してブラウザ上で動作するスタンドアロンのStellar Globe (hscMap) 環境を構築するためのディレクトリです。

## 概要

JupyterLiteは、JupyterLabをWebAssembly (WASM)を使用してブラウザ内で完全に動作させるプロジェクトです。
このディレクトリでは、以下を含むJupyterLite環境をビルドします:

- hscMap Pythonクライアントライブラリ
- stellar-globe JupyterLab拡張
- チュートリアルノートブック

ビルドされたサイトは完全に静的なファイルで構成され、サーバーサイドのPythonやJupyterサーバーを必要とせずに、
任意のWebサーバーやGitHub Pagesなどでホストできます。

## ディレクトリ構成

```
jupyterlite/
├── files/          # ビルド時にJupyterLiteに含めるファイル
│   └── tutorial.ipynb  # hscMapのチュートリアルノートブック
├── pypi/           # JupyterLite環境でインストール可能なPythonパッケージ
│   └── hscmap-0.0.0-py3-none-any.whl
├── _output/        # ビルド結果（静的サイト）
├── pyproject.toml  # Python環境設定
├── Makefile        # ビルドコマンド
└── README.ja.md    # このファイル
```

## 前提条件

- Python 3.8以降
- uvコマンド（Python環境管理）

uvのインストール:
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# または Homebrew
brew install uv
```

## 環境構築

### 1. 開発環境のセットアップ

```bash
make setup
```

このコマンドは以下を実行します:
- `uv sync --dev`で必要なPythonパッケージをインストール
  - jupyterlab
  - jupyterlite-core
  - jupyterlite-pyodide-kernel

### 2. 依存パッケージのビルド

JupyterLiteにhscMapを含めるには、以下のパッケージを事前にビルドする必要があります:

```bash
# appのライブラリ版をビルド
make -C ../../app lib

# hscMap Pythonクライアントライブラリをビルド
make -C ../python build

# JupyterLab拡張をビルド
make -C ../jupyterlab-extension build
```

または、Makefileのターゲットを使用:
```bash
make rebuild-dependencies
```

## ビルド

### 完全なリビルド

依存パッケージを含めて全てをリビルド:

```bash
make rebuild
```

このコマンドは以下を実行します:
1. `rebuild-dependencies`: 依存パッケージのビルド
2. `build`: JupyterLiteサイトのビルド
   - `pypi/`ディレクトリにhscMapのwheelをコピー
   - `files/`ディレクトリにチュートリアルノートブックをコピー
   - JupyterLab拡張をインストール
   - `jupyter lite build`を実行してサイトを生成

### ビルドのみ

依存パッケージが既にビルド済みの場合:

```bash
make build
```

## ローカルでの動作確認

ビルド後、ローカルサーバーでJupyterLiteを起動:

```bash
make serve
```

ブラウザで `http://localhost:8000` にアクセスすると、JupyterLiteが開きます。

### 動作確認手順

1. サーバーを起動: `make serve`
2. ブラウザでアクセス
3. ファイルブラウザから`tutorial.ipynb`を開く
4. セルを実行してhscMapの動作を確認

## デプロイ

ビルドしたサイトをデプロイサーバーにアップロード:

```bash
make deploy
```

これにより、`_output/`ディレクトリの内容が`hscmap.mtk.nao.ac.jp:htdocs/hscMap5/jupyter/`にデプロイされます。

## トラブルシューティング

### ビルドエラー

**エラー: `jupyter lite build` が失敗する**

以下を確認してください:
- 依存パッケージが正しくビルドされているか
  ```bash
  ls ../python/dist/hscmap-0.0.0-py3-none-any.whl
  ls ../jupyterlab-extension/dist/
  ```
- JupyterLab拡張が正しくインストールされているか
  ```bash
  uv run jupyter labextension list
  ```

**エラー: パッケージが見つからない**

`pypi/`ディレクトリにwheelファイルが存在することを確認:
```bash
ls pypi/
```

存在しない場合は、pythonパッケージを先にビルド:
```bash
make rebuild-python
```

### 実行時エラー

**エラー: hscMapがノートブックで動作しない**

1. ブラウザのコンソールでエラーメッセージを確認
2. JupyterLab拡張が正しくロードされているか確認
3. 必要に応じて完全リビルド: `make rebuild`

## JupyterLiteについて

JupyterLiteはJupyterのWebAssembly版で、以下の特徴があります:

- **サーバーレス**: Pythonインタープリタがブラウザ内で動作
- **高速起動**: サーバーサイドの処理が不要
- **簡単デプロイ**: 静的ファイルをホストするだけ
- **オフライン動作**: インターネット接続不要（初回ロード後）

ただし、以下の制限があります:
- Pyodideがサポートするパッケージのみ使用可能
- ファイルI/Oは制限される
- 一部のネイティブ拡張は動作しない

詳細は[JupyterLite公式ドキュメント](https://jupyterlite.readthedocs.io/)を参照してください。

## 参考リンク

- [JupyterLite](https://jupyterlite.readthedocs.io/)
- [Pyodide](https://pyodide.org/)
- [hscMap Python Client](../python/)
- [hscMap JupyterLab Extension](../jupyterlab-extension/)
