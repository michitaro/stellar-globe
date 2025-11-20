# Python Integration

Python環境からStellar Globe (HSC Map) を利用・制御するためのツール群です。

## 構成コンポーネント

### `python` (hscmap)
Pythonからビューワーを操作するためのクライアントライブラリです。
JupyterLab内のウィジェットとして、またはリモートのビューワーを操作するために使用します。

### `jupyterlab-extension`
JupyterLab用の拡張機能です。
JupyterLabのタブ内にHSC Mapを表示し、Pythonカーネルと通信するための機能を提供します。

### `hscmap-server`
JupyterLabを使用せずに、単独のWebサーバーとしてHSC Mapを配信・制御するためのサーバーアプリケーションです。

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
