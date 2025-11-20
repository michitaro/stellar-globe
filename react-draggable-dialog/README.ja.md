# @stellar-globe/react-draggable-dialog

ドラッグ移動やリサイズが可能なダイアログボックスを提供するReactコンポーネントライブラリです。
`stellar-globe` アプリケーションのUI構築に使用されていますが、独立して利用することも可能です。

## 目的

* ドラッグ可能なウィンドウシステムの提供
* ウィンドウの重なり順（Z-index）の管理
* リサイズ機能

## 使用方法

アプリケーション全体（またはダイアログを表示したい領域）を `DialogContext` で囲み、その内部で `Dialog` コンポーネントを使用します。

```tsx
import { DialogContext, Dialog } from "@stellar-globe/react-draggable-dialog";
import "@stellar-globe/react-draggable-dialog/style.css"; // スタイルの読み込みが必要

function App() {
  return (
    <DialogContext>
      <Dialog title="サンプルダイアログ" initialPosition={{ x: 100, y: 100 }}>
        <p>ダイアログの内容です。</p>
      </Dialog>
    </DialogContext>
  );
}
```

## 主要なコンポーネント

### `DialogContext`
ダイアログの状態（位置、サイズ、フォーカスなど）を管理するコンテキストプロバイダーです。
複数のダイアログ間の重なり順を制御します。

### `Dialog`
基本的なダイアログコンポーネントです。
タイトルバーによるドラッグ移動、端によるリサイズが可能です。

### `DarkDialog`
`Dialog` のスタイルバリエーション（ダークテーマ用）です。

## サンプルコードの実行

以下のコマンドで開発サーバーを起動し、サンプルコードを実行できます。

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173/` にアクセスすると、サンプルが表示されます。
`example/Example.tsx` にサンプルコードが含まれています。

## APIドキュメントの生成

TypeDocを使用してAPIドキュメントを生成できます。

```bash
npm run typedoc
```

生成されたドキュメントは `docs` ディレクトリに出力されます。

## サンプルコードの実行

以下のコマンドで開発サーバーを起動し、サンプルコードを実行できます。

```bash
npm install
npm run dev
```
