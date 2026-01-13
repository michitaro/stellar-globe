# 移行ガイド: シンボル名の変更

## 概要

このリリースでは、`@stellar-globe/react-stellar-globe`のすべてのエクスポートされるコンポーネント名から`$`サフィックスを削除しました。古い名前は非推奨となり、将来のメジャーバージョンで削除される予定です。

## 簡易移行

すべての`$`サフィックス付きシンボルを新しい名前に置き換えてください：

```diff
- import { Globe$, PanLayer$, ZoomLayer$ } from '@stellar-globe/react-stellar-globe';
+ import { Globe, PanLayer, ZoomLayer } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
-   <Globe$>
-     <PanLayer$ />
-     <ZoomLayer$ />
-   </Globe$>
+   <Globe>
+     <PanLayer />
+     <ZoomLayer />
+   </Globe>
  );
}
```

## 完全なシンボルマッピング

| 旧名（非推奨） | 新名 |
|--------------|------|
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

## 自動移行

検索・置換ツールを使用してコードベースを移行できます。以下の正規表現パターンが役立ちます：

### VSCodeでの検索・置換

1. 検索・置換を開く（Cmd/Ctrl + H）
2. 正規表現モードを有効にする
3. 検索: `(\w+)\$`
4. 置換: `$1`
5. `@stellar-globe/react-stellar-globe`からimportしているファイルに限定する

### Sedコマンド

```bash
# ドライラン（変更のプレビュー）
sed -n 's/\([A-Z][a-zA-Z]*\)\$/\1/gp' your-file.tsx

# 変更を適用
sed -i '' 's/\([A-Z][a-zA-Z]*\)\$/\1/g' your-file.tsx
```

## 名前衝突の対処

同じファイルで`stellar-globe`（コアライブラリ）と`react-stellar-globe`の両方を使用する場合、名前が衝突する可能性があります。importエイリアスを使用して解決してください：

```typescript
// コアライブラリのクラス
import { Globe as CoreGlobe, TractTileLayer } from 'stellar-globe';

// Reactコンポーネント
import { Globe, TractTileLayer as ReactTractTileLayer } from '@stellar-globe/react-stellar-globe';

// 両方を使用可能
const globe = new CoreGlobe(container);

function App() {
  return (
    <Globe>
      <ReactTractTileLayer baseUrl="..." />
    </Globe>
  );
}
```

## 非推奨タイムライン

- **現在のバージョン**: 旧名（`$`サフィックス）は非推奨ですが、引き続き機能します
- **次のメジャーバージョン**: 旧名は削除されます

スムーズなアップグレードのために、できるだけ早く新しい名前に移行することをお勧めします。

## TypeScriptサポート

TypeScriptを使用している場合、非推奨のシンボルはIDEで取り消し線スタイルで表示されるため、更新が必要なコードを簡単に特定できます。

## 質問がある場合

移行中に問題が発生した場合は、GitHubリポジトリでissueを開いてください。
