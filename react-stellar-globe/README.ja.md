# @stellar-globe/react-stellar-globe

`stellar-globe` をReactアプリケーションから利用するためのラッパーライブラリです。
宣言的なJSX構文で全天ビューワーを構築できます。

## 目的

* Reactコンポーネントとしての `stellar-globe` の提供
* レイヤーの宣言的な管理
* Reactのステート管理との統合

## 使用方法

`Globe$` コンポーネントをルートとして、その子要素として各種レイヤーコンポーネントを配置します。

```tsx
import { Globe$, PanLayer$, ZoomLayer$ } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Globe$>
        <PanLayer$ />
        <ZoomLayer$ />
        {/* その他のレイヤー */}
      </Globe$>
    </div>
  );
}
```

## 主要なコンポーネント

### `Globe$`
ビューワーのコンテナとなるコンポーネントです。内部で `stellar-globe` の `Globe` インスタンスを生成・管理します。

### レイヤーコンポーネント
`stellar-globe` の各レイヤーに対応するReactコンポーネントです。
* `TractTileLayer$`: タイル画像レイヤー
* `PanLayer$`, `ZoomLayer$`, `RollLayer$`: 操作系レイヤー
* `GridLayer$`: グリッドレイヤー
* `ConstellationLayer$`: 星座レイヤー
* `MarkerLayer$`: マーカーレイヤー

### フック
* `useGetGlobe`: `Globe` インスタンスにアクセスするためのフックです。
