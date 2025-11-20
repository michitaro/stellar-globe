# @stellar-globe/stellar-globe

Stellar Globeプロジェクトのコアライブラリです。
WebGLを使用した全天描画エンジンを提供します。

## 目的

* 高速な全天描画（WebGL使用）
* 階層的なタイル画像の表示 (HSC Map, HiPS)
* 座標変換、カメラ制御
* 各種レイヤーによる機能拡張

## 使用方法

`Globe` クラスがエントリーポイントとなります。
HTML要素を指定して `Globe` を初期化し、必要なレイヤーを追加して使用します。

```typescript
import { Globe, SspTileLayer } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
if (container) {
  const globe = new Globe(container);
  
  // レイヤーの追加例
  // globe.addLayer(new SspTileLayer(...));
}
```

## 主要なクラスと関数

### `Globe`
ビューワーの本体です。Canvas要素の管理、レンダリングループ、レイヤーの管理を行います。

### `Layer`
地図上のレイヤーを表す基底クラスです。
以下のようなサブクラスがあります。
* `SspTileLayer`: HSC Map形式のタイル画像を表示するレイヤー。
* `PanLayer`, `ZoomLayer`, `RollLayer`: マウス操作による視点移動を提供するレイヤー。
* `GridLayer`: 座標グリッドを表示するレイヤー。
* `ConstellationLayer`: 星座線を表示するレイヤー。

### `SkyCoord`
天球上の座標を扱うためのクラスです。赤経・赤緯などを管理します。

### `Angle`
角度を扱うためのユーティリティクラスです。度数法、ラジアン、時角などの変換を行います。

## デモの実行

`demo` ディレクトリにサンプルコードがあります。
以下のコマンドで開発サーバーを起動し、デモを実行できます。

```bash
cd stellar-globe
npm install
npm run dev
```

ブラウザで `http://localhost:5173/demo/` にアクセスするとデモが表示されます。

## APIドキュメントの生成

TypeDocを使用してAPIドキュメントを生成できます。

```bash
npm run typedoc
```

生成されたドキュメントは `docs` ディレクトリに出力されます。

以下のコマンドで開発サーバーを起動し、サンプルコードを実行できます。

```bash
npm install
npm run dev
```
