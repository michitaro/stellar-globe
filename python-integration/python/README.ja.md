# Python Integration - hscmap/stellarglobe

Python環境からStellar Globe (HSC Map) アプリケーションを操作するためのクライアントライブラリです。

## 目的

* Python（特にJupyter環境）からHSC Mapを制御
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
メインパッケージディレクトリ。HSC Mapとの通信機能を提供します。

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
   ```bash
   make datamodel
   ```
   このコマンドで `app/jsonschema/public.json` から Python の型ヒント付きデータクラスを生成

3. **実行時検証**: `jsonschema` ライブラリを使用して送受信メッセージを検証
   * Python→app: メッセージ送信前に検証
   * app→Python: メッセージ受信時に検証

### app 側の型チェック

app側の型チェックについては `app/README.ja.md` を参照してください。

### 型の整合性を保つ手順

1. `app/types/commTools/index.d.ts` で型を更新
2. `app` で `npm run refresh-types` を実行
3. `python-integration/python` で `make datamodel` を実行してPython型を再生成
4. Python側のコードを更新して新しい型を使用

## Makefile のターゲット説明

### `make setup`
開発環境のセットアップ。仮想環境の作成と依存パッケージのインストールを行います。

### `make test`
pytestを実行してテストを行います。カバレッジレポートも生成されます。

### `make test-watch`
テストをwatch modeで実行します。ファイル変更時に自動的に再実行されます。

### `make datamodel`
`app/jsonschema/public.json` からPythonのデータモデルを自動生成します。

### `make typecheck`
Pyright を使用して型チェックを行います。

### `make typecheck-watch`
型チェックをwatch modeで実行します。

### `make build`
配布用パッケージをビルドします（wheel, tar.gz）。

### `make deploy`
ビルドしたパッケージをデプロイサーバーにアップロードします。

## デプロイ先

`https://hscmap.mtk.nao.ac.jp/hscMap5/` 以下に以下のファイルが配置されます：

* `app/`: HSC Mapアプリケーション本体
* `jupyter/`: JupyterLab拡張機能
* `python/`: Pythonパッケージ
  * `notebooks/`: チュートリアルノートブック
  * `docs/`: Sphinxドキュメント
  * `dist/`: 配布パッケージ
