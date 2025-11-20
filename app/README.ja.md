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

1. `types/commTools/index.d.ts` で型定義を更新
2. `npm run refresh-types` を実行してJSON Schemaを再生成
3. Python側でも対応する型定義を更新

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
