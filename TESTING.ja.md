# フロントエンドテストガイド

このドキュメントでは、各フロントエンドコンポーネントのテスト方法とカバレッジの取得方法について説明します。

## 概要

全てのフロントエンドコンポーネント（`stellar-globe`, `react-stellar-globe`, `react-draggable-dialog`, `app`）では、以下のツールを使用してテストを実行します：

* **Vitest**: 高速なテストランナー（Viteベース）
* **@testing-library/react**: Reactコンポーネントのテスト
* **jsdom**: ブラウザ環境のシミュレーション

## 共通コマンド

各コンポーネントディレクトリで以下のコマンドが利用可能です：

```bash
# インタラクティブモードでテストを実行（ウォッチモード）
npm run test

# 非インタラクティブモードでテストを実行（CI用）
npm run test:noninteractive

# カバレッジレポート付きでテストを実行
npm run test:noninteractive -- --coverage
```

## コンポーネント別テスト

### stellar-globe

```bash
cd stellar-globe
npm run test:noninteractive -- --coverage
```

**テスト対象:**
* 基本的な数学関数（angle.test.ts）
* キャッシュ機能（cache.test.ts）
* カメラ制御（Camera.test.ts）
* 日付処理（date.test.ts）
* ユーティリティ関数（sprintf.test.ts）

**注意事項:**
* WebGLの機能は実際のブラウザ環境またはヘッドレスブラウザが必要なため、一部の機能はjsdomではテストできません
* レンダリング関連のテストは統合テストとして別途実施が推奨されます

### react-stellar-globe

```bash
cd react-stellar-globe
npm run test:noninteractive -- --coverage
```

**テスト対象:**
* Globeコンポーネントの基本動作（Globe.test.tsx）
* LogScaleRangeコンポーネント（LogScaleRange.test.tsx）
* Reactフックの順序（react-hook-order.test.ts）

### react-draggable-dialog

```bash
cd react-draggable-dialog
npm run test:noninteractive -- --coverage
```

**テスト対象:**
* Dialogコンポーネントの基本動作（Dialog.test.tsx）
* ドラッグ＆ドロップ機能
* リサイズ機能

### app

```bash
cd app
npm run test:noninteractive -- --coverage
```

**テスト対象:**
* Redux store とslices
* CommTools（型検証、JSON Patch、状態管理）
* 各種機能コンポーネント

**注意事項:**
* 現在のテストカバレッジは限定的です
* より多くの統合テストを追加する必要があります

## カバレッジレポート

カバレッジレポートは各コンポーネントの `coverage/` ディレクトリに生成されます：

```bash
# HTMLレポートをブラウザで開く
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

レポートには以下の情報が含まれます：
* **Statements**: 実行された文の割合
* **Branches**: 実行された分岐の割合
* **Functions**: 実行された関数の割合
* **Lines**: 実行されたコード行の割合

## テストカバレッジの目標

* **ユーティリティ関数**: 100%を目指す
* **ビジネスロジック**: 80%以上
* **UIコンポーネント**: 70%以上（WebGL関連を除く）
* **WebGL関連**: E2Eテストで補完

## WebGL関連のテスト

WebGLを使用している機能（レンダリング、シェーダーなど）は、jsdomでは完全にテストできません。
これらの機能については以下のアプローチを推奨します：

1. **ロジックとレンダリングの分離**: ビジネスロジックを分離してユニットテストを作成
2. **E2Eテスト**: Playwright や Cypress などを使用した統合テスト
3. **ビジュアルリグレッションテスト**: スクリーンショット比較によるテスト

## CI/CD統合

非インタラクティブモードとカバレッジレポートは CI/CD パイプラインに統合可能です：

```yaml
# GitHub Actions の例
- name: Run tests
  run: |
    cd stellar-globe && npm run test:noninteractive -- --coverage
    cd ../react-stellar-globe && npm run test:noninteractive -- --coverage
    cd ../react-draggable-dialog && npm run test:noninteractive -- --coverage
    cd ../app && npm run test:noninteractive -- --coverage
```

## トラブルシューティング

### テストが失敗する場合

1. 依存パッケージが最新か確認: `npm install`
2. 他のコンポーネントがビルドされているか確認
3. Node.jsのバージョンを確認（18以降を推奨）

### カバレッジが0%の場合

1. `vitest.config.ts` の `coverage` 設定を確認
2. テストファイルのパスが正しいか確認（`*.test.{ts,tsx}` パターン）
3. `setupFiles` が正しく読み込まれているか確認

### jsdomのエラー

1. `@vitest/ui` を使用してブラウザでテストを実行
2. `environment: 'jsdom'` が設定されているか確認
3. 必要なポリフィル（ResizeObserver など）が `setup.ts` に追加されているか確認

## 参考資料

* [Vitest公式ドキュメント](https://vitest.dev/)
* [Testing Library公式ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
* [jsdomドキュメント](https://github.com/jsdom/jsdom)
