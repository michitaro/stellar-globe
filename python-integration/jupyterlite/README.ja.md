# JupyterLite Build

JupyterLiteを使用してブラウザ上で動作するスタンドアロンのStellar Globe (hscMap) 環境を構築するためのディレクトリです。

## 概要

JupyterLiteは、JupyterLabをWebAssembly (WASM)を使用してブラウザ内で完全に動作させるプロジェクトです。
このディレクトリでは、以下を含むJupyterLite環境をビルドします:

- hscMap Pythonクライアントライブラリ
- stellar-globe JupyterLab拡張
- チュートリアルノートブック
- E2E用smoke notebook
- query-response切り分け用diagnostic notebook

ビルドされたサイトは完全に静的なファイルで構成され、サーバーサイドのPythonやJupyterサーバーを必要とせずに、
任意のWebサーバーやGitHub Pagesなどでホストできます。

## ディレクトリ構成

```
jupyterlite/
├── content/        # JupyterLiteに含める追加notebook
│   ├── e2e-smoke.ipynb  # Playwright用smoke notebook
│   └── query-response-diagnostic.ipynb  # IndexedDB / Window() 切り分け用 notebook
├── files/          # ビルド時にJupyterLiteに含めるファイル（生成物）
│   ├── tutorial.ipynb
│   ├── e2e-smoke.ipynb
│   └── query-response-diagnostic.ipynb
├── pypi/           # JupyterLite環境でインストール可能なPythonパッケージ
│   └── hscmap-0.0.0-py3-none-any.whl
├── _output/        # ビルド結果（静的サイト）
├── tests/          # Playwrightテスト
├── scripts/        # Docker実行ラッパー
├── package.json    # Playwright設定
├── pyproject.toml  # Python環境設定
├── Makefile        # ビルドコマンド
└── README.ja.md    # このファイル
```

## 前提条件

- Python 3.8以降
- uvコマンド（Python環境管理）
- Node.js 18以降（E2Eテスト実行時）
- Docker（`npm run test:e2e:docker` を使う場合）

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
   - `files/`ディレクトリにチュートリアルnotebookとE2E用notebookをコピー
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

### 生成済みサイトだけを配信

E2Eでは `rebuild` せず `_output/` をそのまま配信するため、以下のターゲットも使えます。

```bash
make serve-built
```

`serve-built` は `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` / `Cross-Origin-Resource-Policy` を付けて配信し、JupyterLite のファイル同期を安定させます。

## Playwright E2Eテスト

### セットアップ

```bash
npm install
npm run setup:e2e
```

### ローカル実行

```bash
npm run test:e2e:noninteractive
```

このコマンドは以下を実行します。

1. `make rebuild` で JupyterLite と依存パッケージを再ビルド
2. `make serve-built` で `127.0.0.1:8000` に静的サイトを配信
3. Playwright + Chromium で `e2e-smoke.ipynb` を開いて実行

smoke test では以下を確認します。

- notebook を開ける
- `Window()` で viewer を開ける
- `jump_to()` 後に camera state が更新される
- `snapshot_bytes()` が PNG を返す
- viewer の `canvas` が描画される

### Docker実行

```bash
npm run test:e2e:docker
```

このスクリプトは Playwright 公式Dockerイメージを使用し、Linux では `--network host --ipc=host --init` 前提で実行します。
JupyterLite の file sync は `SharedArrayBuffer` または Service Worker に依存するため、`serve-built` では COI ヘッダ付きの静的サーバを使います。加えて Service Worker 制約に合わせ、Docker 内からも `127.0.0.1` を維持する構成にしています。

### 制約

- Docker実行ラッパーは Linux 前提です
- WebGL は GPU ではなく Chromium の software rendering (`SwiftShader`) 前提です
- 画素単位の比較ではなく、起動・状態同期・snapshot の smoke test を行います

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
4. `query-response-diagnostic.ipynb` を実行し、`secure context` 判定、IndexedDB roundtrip、`load_query_response_from_indexeddb(...)`、`Window()` のどこで失敗するかを確認

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
