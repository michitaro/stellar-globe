# React 19 アップグレードレポート

本ドキュメントでは、このプロジェクトのReact 18からReact 19へのアップグレードについて記録します。

## アップグレード結果

✅ **React 19へのアップグレード完了**

以下のパッケージをReact 19にアップグレードしました:
- `app/` - React 19.0.0+
- `react-stellar-globe/` - React 18.2.0 || 19.0.0 (peerDependencies)
- `react-draggable-dialog/` - React 18.0.0 || 19.0.0 (peerDependencies)

### JupyterLab拡張について

⚠️ **JupyterLab拡張 (`python-integration/jupyterlab-extension/`) はReact 18のまま**

JupyterLab 4は `peerDependencies` で `react: "^18.2.0"` を要求しているため、
JupyterLab拡張はReact 18を維持しています。`react-stellar-globe`と`react-draggable-dialog`は
両方のバージョンをサポートするようにpeerDependenciesを更新しました。

## 主な変更点

### 1. package.json の更新

- `react`, `react-dom` をバージョン ^19.0.0 に更新
- `@types/react`, `@types/react-dom` をバージョン ^19.0.0 に更新
- `use-immer` を ^0.11.0 に更新 (React 19サポート)

### 2. React 19の型変更に対応したコード修正

- `useRef` に初期値が必須になったため、`useRef<T>()` → `useRef<T | undefined>(undefined)` に修正
- `RefObject<T>` → `RefObject<T | null>` の型変更に対応

### 3. 修正したファイル

- `react-draggable-dialog/src/Dialog.tsx`
- `react-draggable-dialog/src/Resizable.tsx`
- `app/src/common/hooks/useFullscreen.ts`
- `app/src/common/hooks/useFocus.ts`
- `app/src/common/components/keybindings.tsx`
- `app/src/common/components/Menu/HoverMenu.tsx`
- `app/src/common/components/Modal/index.tsx`
- `app/src/common/components/Modal/useAsyncPrompt.tsx`
- `app/src/common/components/Tooltip/index.tsx`
- `app/src/app/features/devel/develKeybindings.ts`

## テスト結果

- ✅ `react-stellar-globe` - 型チェック・テスト通過 (11 tests)
- ✅ `react-draggable-dialog` - 型チェック・テスト通過 (2 tests)
- ✅ `app` - 型チェック・テスト通過 (51 tests)
- ✅ `jupyterlab-extension` - ビルド成功 (React 18のまま)

---

## 技術解説: peerDependenciesとReactライブラリのビルド・配布

### peerDependenciesとは

`peerDependencies`は、npmパッケージが「このパッケージを使う側が用意すべき依存関係」を宣言するための仕組みです。

#### 通常の`dependencies`との違い

| 種類 | 意味 | インストール |
|------|------|------------|
| `dependencies` | パッケージ自身が必要とする依存関係 | パッケージと一緒にインストールされる |
| `devDependencies` | 開発時のみ必要な依存関係 | 開発時のみインストール |
| `peerDependencies` | 利用者側が用意すべき依存関係 | 利用者が別途インストールする必要がある |

#### なぜReactライブラリでpeerDependenciesを使うのか

```json
// react-stellar-globe/package.json
{
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0"
  }
}
```

1. **単一インスタンスの保証**
   - Reactは内部で状態を管理しており、複数バージョンが混在すると問題が発生する
   - `peerDependencies`を使うと、アプリケーション全体で1つのReactインスタンスを共有

2. **バージョン互換性の明示**
   - `^18.2.0 || ^19.0.0` のように、サポートするバージョン範囲を明示
   - 利用者は自分のプロジェクトのReactバージョンがサポートされているか確認可能

3. **バンドルサイズの最適化**
   - Reactがライブラリに含まれないため、最終的なバンドルサイズが削減

### Reactライブラリのビルド・配布の仕組み

#### 1. ソースコード構成

```
react-stellar-globe/
├── src/           # TypeScript/TSXソースコード
├── dist/          # ビルド成果物（配布用）
├── types/         # TypeScript型定義ファイル
└── package.json
```

#### 2. package.jsonの設定

```json
{
  "name": "@stellar-globe/react-stellar-globe",
  "types": "./types/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/react-stellar-globe.es.js",
      "types": "./types/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0"
  }
}
```

- **`exports`**: ESモジュール形式でエクスポート
- **`types`**: TypeScript型定義ファイルのパス
- **`peerDependencies`**: 利用者が用意するReactのバージョン

#### 3. ビルドプロセス（Vite使用）

1. **TypeScriptコンパイル**: `.tsx` → `.js`（型チェック）
2. **バンドル**: 複数ファイルを1つにまとめる
3. **外部化**: `peerDependencies`（React等）はバンドルに含めない
4. **型定義生成**: `.d.ts`ファイルを生成

```typescript
// vite.config.ts（概念）
export default {
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom']  // Reactを外部化
    }
  }
}
```

#### 4. 配布時の動作

```
アプリケーション
├── node_modules/
│   ├── react/                 # 1つのReactインスタンス
│   ├── react-dom/
│   ├── @stellar-globe/react-stellar-globe/
│   │   └── dist/              # Reactを含まない
│   └── @stellar-globe/app/
│       └── dist/              # Reactを含まない
```

### JupyterLab拡張の場合

JupyterLab 4は`react: "^18.2.0"`を`peerDependencies`で要求しているため、
JupyterLab拡張はReact 18を使用する必要があります。

```
JupyterLab 4
├── @jupyterlab/ui-components (peerDep: react@^18.2.0)
└── @stellar-globe/jupyterlab-extension
    ├── @stellar-globe/react-stellar-globe (peerDep: react@^18 || ^19)
    └── react@18.x を使用 ← JupyterLabが提供
```

`react-stellar-globe`が両方のバージョンをサポートしているため、
JupyterLab環境ではReact 18で、スタンドアロンアプリでは React 19で動作します。
