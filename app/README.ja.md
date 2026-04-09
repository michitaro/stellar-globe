# @stellar-globe/app

Stellar Globeプロジェクトのメインアプリケーションです。
hscMapとして動作するWebアプリケーションの実装を含みます。

## 目的

* 全天ビューワーアプリケーションの提供
* Jupyter環境（JupyterLab, JupyterLite）との連携
* ユーザーインターフェースの提供

## 使用方法

### 開発サーバーの起動

```bash
npm install
npm run dev
```

### ビルド

```bash
npm run build-lib       # ライブラリとしてビルド
npm run build-standalone # スタンドアロンアプリとしてビルド
```

## 設計方針

* **Reduxの利用**: アプリケーションの状態管理にRedux (Redux Toolkit) を使用しています。これにより、外部（Pythonなど）からの状態操作を容易にしています。
* **Jupyter連携**: Jupyterの機能を利用することで、グラフ表示などの高度な解析機能を委譲し、本体の軽量化を図っています。

## アプリケーション構成

### ディレクトリ構造

* **`src/app/`**: メインアプリケーションコード
  * `store/`: Redux store の定義とslices
  * `features/`: 各機能ごとのコンポーネント・ロジック
  * `MainViewer.tsx`: メインのビューワーコンポーネント
  * `AppDialog/`: ダイアログコンポーネント群
  * `MainMenu/`: メニューバー
  * `keybindings/`: キーボードショートカット

* **`src/commTools/`**: 外部（Python）との通信ツール
  * `toAppTypeValidation/`: アプリへのメッセージの型検証
  * `actionTypeValidation/`: Reduxアクションの型検証
  * `storesync/`: Reduxストアの同期
  * `jsonpatch/`: JSON Patchによる差分更新

* **`src/common/`**: 共通ユーティリティ

* **`src/standalone/`**: スタンドアロン版アプリケーションのエントリーポイント

### Reduxストア

Redux Toolkitを使用して状態管理を行っています。
主なslicesは以下の通りです：

* `baseImageSlice`: ベース画像の設定
* `catalogSlice`: カタログデータ
* `globeSlice`: Globeビューワーの状態
* その他、各機能に対応したslice

## 主要な機能

* 全天画像の表示・操作
* カタログデータのオーバーレイ
* 外部連携API (CommTools)

## CAS SQL 機能

CAS が有効な target では、`app` から `/datasearch/skymaps_api/` 経由で CAS に SQL を発行できます。

* SQL エディタは Monaco Editor ベースの dialog として提供されます
* `CAS SQL` / `CAS Jobs` dialog と、矩形 region からの `Query CAS` 導線が追加されます
* SQL エディタでは release / rerun 選択、release ごとの sample query、`Queue` / `No Mail`、`$rerun` と `$coord_in_selection_box` 展開を利用できます
* preview 結果は catalog として読み込みでき、job list から完了ジョブの CSV / CSV.gz 取り込み、cancel、delete ができます

### 有効化方法

`.env` ファイルでは `VITE_target` だけを設定し、target ごとの CAS 有効化・release・sample query は `src/app/env/` 以下で定義します。

* `app/vite/env/.env`: `VITE_target=public`
* `app/vite/env/.env.internal`: `VITE_target=internal`
* `app/vite/env/.env.u2k`: `VITE_target=u2k`

別の配備先を追加する場合は、対応する `VITE_target` と `src/app/env/` の target 定義を追加してください。

## Python連携のための型チェック機構

`app` とPython側の通信では、実行時に型の整合性をチェックする仕組みが実装されています。

### 仕組み

1. **TypeScript型定義**: `types/commTools/index.d.ts` にメッセージとアクションの型を定義
2. **JSON Schemaの生成**: `typescript-json-schema` を使用してTypeScript型からJSON Schemaを自動生成
   ```bash
   npm run make-toapp-typevalidator    # ToAppメッセージ用
   npm run make-action-typevalidator   # Reduxアクション用
   ```
3. **実行時検証**: `ajv` ライブラリを使用してJSON Schemaに基づいて実行時に型検証を行う
   * Python→app: `validateToAppMessage()` 関数で検証
   * Python→Redux: `validateAction()` 関数で検証

### Python側の型定義

Python側では、同じJSON Schemaを使用して型チェックを行います。
詳細は `python-integration/python` のドキュメントを参照してください。

### 型の更新手順

型定義を更新する際は、変更する場所に応じて以下の手順に従ってください。

#### Reduxアクションの型を変更する場合

例：`catalogAdded` アクションに新しいフィールドを追加する場合

1. **TypeScript側の型を更新**
   - `src/app/features/catalog/catalogSlice.ts` などの対応するSliceファイルで型（例：`NewCatalogParams`）を更新
   - reducerの実装も必要に応じて更新

2. **JSON Schemaを再生成**
   ```bash
   cd app
   npm run refresh-types
   ```

3. **Python側のモデルを再生成**
   ```bash
   cd python-integration/python
   make datamodel
   ```
   これにより `src/hscmap/models/` 以下のファイルが更新されます。

4. **Python側のコードを更新**
   - 新しいフィールドを使用するPythonコードを更新（例：`catalogs.py`）

5. **型チェックを実行**
   ```bash
   # TypeScript側
   cd app && npx tsc --noEmit
   
   # Python側
   cd python-integration/python && make typecheck
   ```

#### ToAppメッセージの型を変更する場合

1. `types/commTools/index.d.ts` で型定義を更新
2. `npm run refresh-types` を実行してJSON Schemaを再生成
3. Python側で `make datamodel` を実行してPython型を再生成
4. Python側のコードを更新して新しい型を使用

## Pythonとのやりとりの詳細

### 概要

`app` はJupyter環境（JupyterLab、JupyterLite）からPythonを通じて制御できるように設計されています。
通信は主にJupyter Commメカニズムを通じて行われ、iframe内で動作する `app` とJupyterLabのウィジェット間でメッセージをやり取りします。

### メッセージの受信

`app` は以下の2つのAPIを提供しており、外部からメッセージを受け取ります：

1. **`AppHandle.dispatchAction()`**
   - Redux アクションをディスパッチするAPI
   - `app/src/app/index.tsx` の `AppHandle` 型で定義
   - JupyterLab拡張は `ToApp.Dispatch` メッセージを受け取ると、このメソッドを呼び出す

2. **直接的なメソッド呼び出し**
   - `AppHandle` 型で定義されている各種メソッド（`globe()`, `getState()`, `activate()`, `deactivate()` など）
   - iframe経由でなく、直接 `AppHandle` インスタンスにアクセスできる場合に利用

### メッセージフロー

#### Python → app

1. **Pythonからのメッセージ送信**
   ```python
   # hscmapライブラリから
   window.jump_to(ra=180, dec=0, fov=1)
   ```

2. **Jupyter Commでの転送**
   - Pythonライブラリ (`python-integration/python`) が `ToApp` 型のメッセージをJupyter Comm経由で送信
   - メッセージは `types/commTools/index.d.ts` で定義された型に準拠

3. **JupyterLab拡張での受信**
   - `python-integration/jupyterlab-extension/src/StellarGlobeWidget.tsx` の `onMsgFromPython()` 関数がメッセージを受信
   - `validateToAppMessage()` で型チェック
   - メッセージタイプに応じた処理を実行：
     * `Dispatch`: Redux actionをdispatch
     * `JumpTo`: 座標へのジャンプ
     * `ShowError`: エラーダイアログの表示
     * など

4. **appでの処理**
   - Redux actionの場合、通常のReduxフローで処理
   - storeが更新され、UIが再レンダリング

#### app → Python

1. **appからのイベント**
   - Redux storeの変更が `onStoreChange` コールバックで検出される
   - `python-integration/jupyterlab-extension/src/StellarGlobeWidget.tsx` で実装

2. **状態の差分計算**
   - `StateManager` クラス (`app/src/commTools/storesync/StateManager.ts`) が状態の履歴を管理
   - `generateJsonPatch()` でJSON Patch形式の差分を計算

3. **Jupyter Commでの送信**
   - `FromApp.StoreChanged` メッセージとして差分を送信
   - Pythonライブラリが受信して、状態を同期

4. **Pythonでの処理**
   - 受信した差分をPython側の状態モデルに適用
   - 必要に応じてコールバックを実行

### メッセージの型定義

#### ToApp（Python → app）

`types/commTools/index.d.ts` で定義されています：

* `Open`: 新しいウィンドウを開く
* `Close`: ウィンドウを閉じる
* `Dispatch`: Redux actionをdispatch
* `ShowError`: エラーメッセージを表示
* `JumpTo`: 指定座標にジャンプ
* `QueryState`: 現在の状態を問い合わせ
* など

#### FromApp（app → Python）

* `Ready`: appの初期化完了を通知
* `Closed`: ウィンドウが閉じられた
* `StoreChanged`: Redux storeが変更された（差分情報を含む）
* `QueryStateResponse`: 状態問い合わせへの応答

### 型安全性の確保

#### 実行時検証

1. **受信時の検証**
   - `validateToAppMessage()`: Python→appのメッセージを検証
   - `validateAction()`: Redux actionを検証
   - `ajv` ライブラリを使用してJSON Schemaベースの検証

2. **送信時の検証**
   - TypeScriptの型システムで送信メッセージの型をチェック
   - コンパイル時にエラーを検出

#### 開発時の型チェック

1. **TypeScript型定義**
   - `types/commTools/index.d.ts` で全メッセージの型を定義
   - 実装コードで型を参照し、コンパイラがチェック

2. **Python型定義**
   - `app/jsonschema/public.json` から自動生成
   - `dataclasses-json` を使用して型ヒント付きクラスを生成

### ストア同期の仕組み

`StateManager` クラスは以下の機能を提供します：

1. **履歴管理**
   - 直近N個の状態を保持（デフォルト5個）
   - リビジョン番号で管理

2. **差分計算**
   - `generateJsonPatch()` でJSON Patch (RFC 6902) 形式の差分を生成
   - 大きな状態でも効率的に転送

3. **部分的な同期**
   - `patchFrom(baseRevision)` で指定リビジョンからの差分を取得
   - ネットワークの遅延やロスに対応

## 型情報の更新

型定義ファイルを更新する場合は以下のコマンドを実行してください。

```bash
npm run refresh-types
```

このコマンドは以下を実行します：
* ToAppメッセージの型検証用JSON Schema生成
* Reduxアクションの型検証用JSON Schema生成
* 永続化状態の型検証用JSON Schema生成
* 公開用JSON Schema生成
