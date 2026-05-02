# `hscmap-server`

`hscmap-server` は、JupyterLabを使わずに Stellar Globe (`hscMap`) を起動するための小さなHTTP/WebSocketサーバーです。Reactフロントエンドのビルド成果物を配信し、ブラウザ上のビューワーとPythonの `hscmap` クライアントライブラリの間でメッセージを中継します。

通常のPythonプロセス、コマンドライン中心の作業環境、またはJupyterLab拡張を使えない環境からStellar Globeを制御したい場合に使用します。

## 提供するもの

- 指定したhost/portで待ち受けるコマンドラインプログラム `hscmap-server`
- ビルドしたStellar Globeフロントエンドの静的配信
- Pythonとブラウザ間の状態更新・操作コマンドを中継する `/comms` 配下のWebSocket endpoint
- `--host` や `--port` を変えてもフロントエンドを再ビルドせずに動く同一origin接続

## セットアップ

Python依存関係を入れ、フロントエンドを一度ビルドします。`make build-frontend` は、ViteアプリがimportするローカルのStellar Globeパッケージもあわせてビルドします。生成先の `src/hscmapserver/static/dist/` はビルド成果物なのでgit管理しません。

```bash
make setup
make build-frontend
```

## コマンドラインから起動する

```bash
uv run hscmap-server --host 127.0.0.1 --port 8000
```

`http://127.0.0.1:8000/` を開くと、Stellar Globeを単体で表示できます。Pythonから制御する場合は、同じfrontend/backend URLを指定して `Window` を作成します。

```python
from hscmap import Window
from hscmap.comm.hscmapserver import HscmapServerCommOptions

w = Window(comm_options=HscmapServerCommOptions(
    frontend_url="http://127.0.0.1:8000",
    backend_url="ws://127.0.0.1:8000",
    open_browser=True,
))
```

`open_browser=False` の場合、Pythonクライアントは生成された通信IDを含むURLを表示します。そのURLをブラウザで開くとビューワーが接続されます。

## 独自のstatic directoryを使う

通常は `make build-frontend` で生成したフロントエンドビルドを使用します。開発時に別のビルド成果物を配信したい場合は、次のように指定できます。

```bash
uv run hscmap-server --port 9000 --static-dir ./static/dist
```

指定先には `index.html` とViteの `assets/` directory が必要です。

## 開発用コマンド

```bash
make dev            # 127.0.0.1:8000 でサーバーを起動
make test           # Pythonテストを実行
make build-frontend # ReactフロントエンドをPython package内へビルド
```
