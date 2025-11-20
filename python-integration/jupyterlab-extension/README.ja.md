# stellar_globe_jupyterlab_extension

JupyterLabの拡張機能として、Stellar Globe (HSC Map) をJupyterLabのタブ内に表示するためのパッケージです。

## 目的

* JupyterLabのタブ内でHSC Mapを表示
* PythonカーネルとHSC Map間の通信をJupyter Commで実現
* データ解析とビジュアライゼーションの統合環境を提供

## 動作環境

- JupyterLab >= 4.0.0

## インストール

```bash
pip install stellar_globe_jupyterlab_extension
```

## パッケージ構成

### TypeScript側 (`src/`)

* `StellarGlobeWidget.tsx`: メインのReactウィジェット。HSC Mapアプリケーションをiframe内に表示
* `index.ts`: JupyterLab拡張のエントリーポイント
* `types.ts`: 型定義
* `eventemitter.ts`: イベントハンドリング
* `lockWindow.tsx`: ウィンドウのロック機能

### Python側 (`stellar_globe_jupyterlab_extension/`)

* `__init__.py`: Python拡張の初期化
* `labextension/`: ビルドされたJavaScript/CSSファイル（配布用）

### 通信の仕組み

1. Python側で `hscmap.Window()` を呼び出すとJupyter Commが作成される
2. JupyterLab拡張がCommを検出し、新しいタブでHSC Mapを開く
3. Python↔HSC Map間でComm経由でメッセージをやり取り

## 開発手順

### 開発環境のセットアップ

Node.js が必要です。

```bash
# リポジトリのクローン
git clone <repository>
cd python-integration/jupyterlab-extension

# 開発モードでインストール
pip install -e "."

# JupyterLabとリンク
jupyter labextension develop . --overwrite

# TypeScriptソースのビルド
jlpm build
```

### 開発サーバーの起動

ソースコードの変更を自動的にリビルドするには：

```bash
# ターミナル1: ソースの監視と自動リビルド
jlpm watch

# ターミナル2: JupyterLabの起動
jupyter lab
```

`jlpm watch` を実行しながら開発すると、ファイル保存時に自動的にリビルドされ、JupyterLabをリフレッシュすることで変更が反映されます。

### デバッグ

ソースマップを有効にしてビルドするには：

```bash
jupyter lab build --minimize=False
```

これにより、ブラウザの開発者ツールでデバッグしやすくなります。

### 開発モードのアンインストール

```bash
pip uninstall stellar_globe_jupyterlab_extension
```

また、`jupyter labextension list` で確認できる `labextensions` フォルダ内の `@stellar-globe/jupyterlab-extension` シンボリックリンクを削除する必要があります。

## パッケージング

リリース手順については [RELEASE.md](RELEASE.md) を参照してください。
