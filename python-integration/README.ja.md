# Python Integration

Python環境からStellar Globe (hscMap) を利用・制御するためのツール群です。

## 構成コンポーネント

### `python` (hscmap)

Pythonからビューワーを操作するためのクライアントライブラリです。
JupyterLab内のウィジェットとして、またはリモートのビューワーを操作するために使用します。

このライブラリは、Jupyter Comm（Jupyterカーネルとフロントエンド間の双方向通信チャネル）を使用して、
PythonコードからhscMapアプリケーションへメッセージを送信します。

### `jupyterlab-extension`

JupyterLab用の拡張機能です。
JupyterLabのタブ内にhscMapを表示し、Pythonカーネルと通信するための機能を提供します。

#### Jupyter Extensionとは

JupyterLabは拡張機能によって機能を追加できるプラグインアーキテクチャを持っています。
拡張機能は主に以下の要素で構成されます：

1. **フロントエンド部分**（TypeScript/React）
   - JupyterLabのUIに統合されるコンポーネント
   - タブ、サイドバー、メニューなどのUI要素を追加
   - 本プロジェクトでは、iframe内にhscMapを表示するReactウィジェットを実装

2. **通信レイヤー**（Jupyter Comm）
   - Pythonカーネルとフロントエンド間の双方向通信
   - `ipykernel.comm` (Python側) と `@jupyterlab/services` (TypeScript側) を使用
   - 任意のJSONシリアライズ可能なメッセージを送受信可能

3. **パッケージング**
   - Python パッケージ（pip installable）
   - npm パッケージ（フロントエンドコード）
   - 両方を含む統合パッケージとして配布

#### このプロジェクトでの実装

`jupyterlab-extension` は以下の役割を果たします：

1. **Commの監視**
   - `stellar-globe` という名前のCommが作成されるのを監視
   - Python側で `hscmap.Window()` が呼ばれるとCommが作成される

2. **ウィジェットの生成**
   - Commを検出すると、新しいタブでhscMapアプリケーションを開く
   - React コンポーネントとして `@stellar-globe/app` をレンダリング

3. **メッセージの中継**
   - Python側からのメッセージ（`ToApp`型）を受信し、iframe内のappに転送
   - App側からのメッセージ（`FromApp`型）を受信し、Comm経由でPythonに転送
   - メッセージは型チェックされ、JSON Schemaに準拠していることを確認

4. **状態の同期**
   - App の Redux store の変更を監視
   - JSON Patch形式で差分を計算し、効率的にPython側に同期

### `hscmap-server`

JupyterLabを使用せずに、単独のWebサーバーとしてhscMapを配信・制御するためのサーバーアプリケーションです。`hscmap-server --port 8000` のようにコマンドラインから起動し、指定したportでStellar Globeのフロントエンドを配信します。

PythonクライアントとはWebSocketで接続し、Python側の操作コマンドとブラウザ側の状態更新を中継します。Jupyter環境を使わずにhscMapを利用したい場合や、独自のWebアプリケーションに組み込む場合に使用します。

## 使用方法

### JupyterLabでの利用

```bash
pip install hscmap
jupyter labextension install @stellar-globe/jupyterlab-extension
```

Pythonコード例:

```python
import hscmap

# ウィンドウを開く
w = hscmap.Window()

# 座標を指定して移動
w.jump_to(ra=180, dec=0, fov=1)
```
