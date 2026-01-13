# シンボル名変更の提案

## 概要

`react-stellar-globe`パッケージで末尾に`$`が付いたシンボル名を、`$`を削除したシンプルな名前に変更する。

## 対象シンボル一覧

| 現在の名前 | 変更後の名前 |
|-----------|-------------|
| `Globe$` | `Globe` |
| `PanLayer$` | `PanLayer` |
| `ZoomLayer$` | `ZoomLayer` |
| `RollLayer$` | `RollLayer` |
| `TouchLayer$` | `TouchLayer` |
| `ConstellationLayer$` | `ConstellationLayer` |
| `EsoMilkyWayLayer$` | `EsoMilkyWayLayer` |
| `GridLayer$` | `GridLayer` |
| `HipparcosCatalogLayer$` | `HipparcosCatalogLayer` |
| `TextLayer$` | `TextLayer` |
| `TractTileLayer$` | `TractTileLayer` |
| `MarkerLayer$` | `MarkerLayer` |
| `ClickableMarkerLayer$` | `ClickableMarkerLayer` |
| `PathLayer$` | `PathLayer` |
| `BeautifulObjectLayer$` | `BeautifulObjectLayer` |
| `GlobeEventLayer$` | `GlobeEventLayer` |
| `HipsSimpleLayer$` | `HipsSimpleLayer` |
| `DomLayer$` | `DomLayer` |

---

## 使用例

```typescript
// Before
import { Globe$, PanLayer$, ZoomLayer$ } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
    <Globe$>
      <PanLayer$ />
      <ZoomLayer$ />
    </Globe$>
  );
}

// After
import { Globe, PanLayer, ZoomLayer } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
    <Globe>
      <PanLayer />
      <ZoomLayer />
    </Globe>
  );
}
```

---

## 名前衝突への対処

コアライブラリ`stellar-globe`とReactラッパーを同時に使う場合、名前が衝突する可能性があります。
その場合は、import時にエイリアスを使用してください：

```typescript
import { Globe as CoreGlobe } from 'stellar-globe';
import { Globe } from '@stellar-globe/react-stellar-globe';

// CoreGlobe: コアライブラリのGlobeクラス
// Globe: ReactコンポーネントのGlobe
```

---

## 移行戦略

### Phase 1: エイリアスの追加（互換性維持）

新しい名前でexportを追加し、古い名前は`@deprecated`アノテーション付きで残す。

```typescript
// index.ts
export { Globe } from './Globe'

/** @deprecated Use Globe instead */
export { Globe as Globe$ } from './Globe'
```

### Phase 2: ドキュメント・サンプルの更新

- `README.ja.md`, `README.md` を新しい名前に更新
- `examples/` のコードを更新

### Phase 3: 内部使用箇所の更新

- `app/` 内の使用箇所を新しい名前に変更（約15ファイル、70箇所以上）

### Phase 4: 古い名前の削除

次のメジャーバージョンで`$`付きの名前を完全に削除。

---

## 影響範囲

### 変更が必要なファイル

**react-stellar-globe/内:**
- `src/index.ts` - export文の変更
- `src/Globe.tsx` - コンポーネント名の変更
- `src/layers/*.ts` - 各レイヤーコンポーネント名の変更

**app/内:**
- 約15ファイルでimport文とJSX内の使用箇所を変更

**examples/内:**
- `examples/BasicUsage/main.tsx`

**ドキュメント:**
- `README.ja.md`
- `README.md`
