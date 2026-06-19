# `jupyterlab-bridge`

JupyterLab の notebook / kernel / comm の接続差異を吸収する内部 helper package です。

## 役割

- notebook panel ごとの kernel lifecycle を追跡する
- comm target 登録を一元化する
- 同一 comm open の多重処理を防ぐ
- session 終了時に consumer へ通知する

`stellar_globe_jupyterlab_extension` はこの package を使って JupyterLab 4.0〜4.6 の差異を局所化します。
