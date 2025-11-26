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
* `SspTileLayer`: hscMap形式のタイル画像を表示するレイヤー。
* `PanLayer`, `ZoomLayer`, `RollLayer`: マウス操作による視点移動を提供するレイヤー。
* `GridLayer`: 座標グリッドを表示するレイヤー。
* `ConstellationLayer`: 星座線を表示するレイヤー。

### `SkyCoord`
天球上の座標を扱うためのクラスです。赤経・赤緯などを管理します。

### `Angle`
角度を扱うためのユーティリティクラスです。度数法、ラジアン、時角などの変換を行います。

## ビジュアルエフェクト

`VisualEffectParams` を継承したクラスを使用して、描画に後処理エフェクトを適用できます。

### 利用可能なエフェクト

| クラス名 | 説明 |
|---------|------|
| `GlowEffect` | 明るい部分を光らせるグロー/ブルーム効果 |
| `FrostedGlassEffect` | すりガラス越しに見るようなぼかし効果 |
| `RippleEffect` | 水面の波紋のような変形効果（アニメーション対応） |
| `WarpEffect` | Star Warsのハイパースペースジャンプのような光の筋効果 |
| `PlanetariumEffect` | プラネタリウム投影用の魚眼変形 |
| `PassThroughEffect` | 何も変更しないパススルー（デバッグ用） |

### 使用例

```typescript
import { Globe, GlowEffect, WarpEffect } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
const globe = new Globe(container, {
  // コンストラクタでエフェクトを指定
  visualEffect: new GlowEffect()
});

// または動的にエフェクトを変更
globe.setVisualEffect(new WarpEffect());

// エフェクトを解除
globe.setVisualEffect(null);
```

### エフェクトのパラメータ調整

各エフェクトにはパラメータがあり、効果の強度などを調整できます。

```typescript
const glow = new GlowEffect();
glow.intensity = 1.5;  // グローの強度
glow.threshold = 0.4;  // グローの閾値
glow.radius = 4.0;     // グローの拡散範囲

globe.setVisualEffect(glow);
```

### アニメーション対応エフェクト

一部のエフェクト（`RippleEffect`, `FrostedGlassEffect`）はアニメーションに対応しています。
`update(deltaTime)` メソッドを呼び出すことで時間経過による変化を実現できます。

```typescript
const ripple = new RippleEffect();
globe.setVisualEffect(ripple);

// アニメーションループ
let lastTime = performance.now();
function animate() {
  const now = performance.now();
  ripple.update(now - lastTime);
  lastTime = now;
  globe.requestRefresh();
  requestAnimationFrame(animate);
}
animate();
```

### カスタムエフェクトの作成

`VisualEffectParams` を継承して独自のエフェクトを作成できます。

```typescript
import { VisualEffectParams, Program } from '@stellar-globe/stellar-globe';

class MyCustomEffect extends VisualEffectParams {
  myParam = 1.0;

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D u_raw;
      uniform mat2 u_tex_matrix;
      uniform float u_my_param;
      varying vec2 v_coord;

      void main(void) {
        vec2 texCoord = u_tex_matrix * v_coord;
        vec4 color = texture2D(u_raw, texCoord);
        // ここにカスタム処理を記述
        color.rgb *= u_my_param;
        gl_FragColor = color;
      }
    `;
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_my_param: this.myParam
    });
  }
}
```

## デモの実行

`demo` ディレクトリにサンプルコードがあります。
以下のコマンドで開発サーバーを起動し、デモを実行できます。

```bash
cd stellar-globe
npm install
npm run dev
```

ブラウザで `http://localhost:5173/demo/` にアクセスするとデモが表示されます。

### ビジュアルエフェクトのデモ

デモページでは、以下のキーボードショートカットでエフェクトを切り替えられます：

| キー | エフェクト |
|------|-----------|
| `0` | エフェクトなし |
| `1` | グロー |
| `2` | すりガラス |
| `3` | 波紋 |
| `4` | ワープ |
| `5` | プラネタリウム |
| `W` | ワープ効果の開始/終了 |

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
