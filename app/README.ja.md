# @stellar-globe/app

Stellar Globeプロジェクトのメインアプリケーションです。
HSC Mapとして動作するWebアプリケーションの実装を含みます。

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

## 主要な機能

* 全天画像の表示・操作
* カタログデータのオーバーレイ
* 外部連携API (CommTools)

## 型情報の更新

型定義ファイルを更新する場合は以下のコマンドを実行してください。

```bash
npm run refresh-types
```
