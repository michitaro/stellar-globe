# stellar_globe_jupyterlab_extension

JupyterLabの拡張機能として、Stellar Globe (hscMap) をJupyterLabのタブ内に表示するためのパッケージです。

## 目的

* JupyterLabのタブ内でhscMapを表示
* PythonカーネルとhscMap間の通信をJupyter Commで実現
* データ解析とビジュアライゼーションの統合環境を提供

## 動作環境

- JupyterLab >= 4.0.0

## インストール

```bash
pip install stellar_globe_jupyterlab_extension
```

## パッケージ構成

### TypeScript側 (`src/`)

* `StellarGlobeWidget.tsx`: メインのReactウィジェット。hscMapアプリケーションをiframe内に表示
* `index.ts`: JupyterLab拡張のエントリーポイント
* `types.ts`: 型定義
* `eventemitter.ts`: イベントハンドリング
* `lockWindow.tsx`: ウィンドウのロック機能

### Python側 (`stellar_globe_jupyterlab_extension/`)

* `__init__.py`: Python拡張の初期化
* `labextension/`: ビルドされたJavaScript/CSSファイル（配布用）

### 通信の仕組み

1. Python側で `hscmap.Window()` を呼び出すとJupyter Commが作成される
2. JupyterLab拡張がCommを検出し、新しいタブでhscMapを開く
3. Python↔hscMap間でComm経由でメッセージをやり取り

## Pythonプロセスとappの中継の詳細

この拡張機能は、Pythonカーネルとiframe内で動作する `@stellar-globe/app` の間のメッセージ中継を担当します。

### アーキテクチャ概要

```
Python Kernel (ipykernel)
    ↕ Jupyter Comm
JupyterLab Extension (TypeScript)
    ↕ AppHandle API
iframe内のApp (@stellar-globe/app)
```

### 起動フロー

1. **Comm の作成（Python側）**
   ```python
   # hscmap ライブラリから
   window = hscmap.Window()
   ```
   これにより、`stellar-globe` という名前のJupyter Commが作成されます。

2. **Comm の検出（拡張機能側）**
   - `src/index.ts` の `activateCommPlugin()` が全てのCommを監視
   - `stellar-globe` という名前のCommを検出すると `makeStellarGlobeWidget()` を呼び出し

3. **ウィジェットの生成**
   - `StellarGlobeWidget.tsx` で新しいReactウィジェットを生成
   - `@stellar-globe/app` をiframe内にレンダリング
   - JupyterLabのタブとして表示

4. **初期化完了通知**
   - `AppHandle` の `ref` が設定されると、`useLayoutEffect` が実行
   - `FromApp.Ready` メッセージをPython側に送信
   - 現在の状態とリビジョン番号を含む

### メッセージの中継（Python → app）

1. **Python側からの送信**
   ```python
   window.jump_to(ra=180, dec=0, fov=1)
   ```
   これは内部的に `ToApp.JumpTo` メッセージをCommに送信

2. **拡張機能での受信**
   - `onMsgFromPython()` 関数がComm経由でメッセージを受信
   - `src/StellarGlobeWidget.tsx` で実装

3. **型チェック**
   ```typescript
   const { errors } = validateToAppMessage(type, message)
   ```
   `@stellar-globe/app/commTools` の `validateToAppMessage()` を使用
   JSON Schemaに基づいて実行時検証を実行

4. **メッセージタイプ別の処理**
   - `Dispatch`: `appHandle.dispatchAction()` を呼び出してRedux actionをdispatch
   - `JumpTo`: （Dispatch経由で実装される特殊なaction）
   - `ShowError`: JupyterLabの `showErrorMessage()` を呼び出し
   - `Close`: ウィジェットを閉じる
   - `QueryState`: 現在の状態を問い合わせ（後述）
   - その他: ウィンドウロック、タイトル更新など

5. **appでの処理**
   - Redux actionの場合、通常のReduxフローで処理される
   - storeが更新され、Reactコンポーネントが再レンダリング

### メッセージの中継（app → Python）

1. **状態変更の検出**
   ```typescript
   const onStoreChange: OnStoreChange = ({ state }) => {
     const patch = stateManager.pushState(state)
     sendMsgToJupyter(comm, 'StoreChanged', patch)
   }
   ```
   `@stellar-globe/app` の `onStoreChange` コールバックで検出

2. **差分の計算**
   - `StateManager` クラスが状態の履歴を保持
   - `pushState()` で新しい状態を追加し、JSON Patchを生成
   - JSON Patch (RFC 6902) 形式で差分を表現

3. **Commへの送信**
   ```typescript
   sendMsgToJupyter(comm, 'StoreChanged', patch)
   ```
   `FromApp.StoreChanged` メッセージとして送信
   - `baseRevision`: 差分のベースとなるリビジョン
   - `patch`: JSON Patch形式の差分

4. **Python側での受信**
   - `hscmap.Window` クラスが `FromApp` メッセージを受信
   - JSON Patchを適用して状態を更新
   - 登録されたコールバックを実行

### 状態の同期と問い合わせ

ネットワークの遅延やメッセージロストに対応するため、問い合わせ機能を実装しています。

1. **状態の問い合わせ（Python → app）**
   ```python
   # Python側から
   state = window.query_state()
   ```
   これは `ToApp.QueryState` メッセージを送信：
   ```typescript
   { queryId: "...", baseRevision: 123 }
   ```

2. **拡張機能での処理**
   ```typescript
   QueryState: async ({ queryId, baseRevision }) => {
     const batchPatch = stateManager().patchFrom(baseRevision)
     await typedRespondToQuery('QueryStateResponse', queryId, batchPatch)
   }
   ```
   - `StateManager.patchFrom()` で指定リビジョンからの差分を計算
   - リビジョンが古すぎて履歴にない場合は、完全な状態を返す

3. **Python側での受信**
   - `FromApp.QueryStateResponse` メッセージを受信
   - 差分または完全な状態を適用
   - Promise が解決され、呼び出し元に結果を返す

### エラーハンドリング

1. **型チェックエラー**
   - メッセージが型定義に準拠しない場合、アラートを表示
   - エラー内容をコンソールに出力
   - メッセージは破棄される

2. **通信エラー**
   - Commが閉じられた場合、クリーンアップ処理を実行
   - `EventEmitter` パターンで複数のクリーンアップハンドラを管理

3. **ウィジェットのクローズ**
   - ユーザーがタブを閉じた場合、`onCloseRequest()` が呼ばれる
   - `FromApp.Closed` メッセージをPython側に送信
   - Commを閉じて、リソースを解放

### ウィジェット環境の管理

`widgetEnvs` Mapで全てのウィジェットインスタンスを管理：

```typescript
export const widgetEnvs = new Map<string, StellarGlobeWidgetEnv>()
```

これにより：
- ウィンドウIDからウィジェットを検索可能
- 複数ウィンドウ間の連携機能（ロック機能など）を実現
- Python側から任意のウィンドウに対してメッセージを送信可能

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
