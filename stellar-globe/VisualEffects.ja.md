# ビジュアルエフェクト詳細ドキュメント

`VisualEffectParams` を継承したクラスを使用して、描画に後処理エフェクトを適用できます。

## 利用可能なエフェクト

### 基本エフェクト

| クラス名 | 説明 |
|---------|------|
| `GlowEffect` | 明るい星や白いマーカーなど、高輝度部分の周囲をにじませて強調する |
| `GaussianBlurEffect` | ガウシアンぼかし効果 |
| `BloomEffect` | Glow より広めに高輝度部分をにじませ、発光感を足す |
| `FrostedGlassEffect` | すりガラス越しに見るようなぼかし効果 |
| `PassThroughEffect` | 何も変更しないパススルー（デバッグ用） |

### 変形エフェクト

| クラス名 | 説明 |
|---------|------|
| `RippleEffect` | 水面の波紋のような変形効果（アニメーション対応） |
| `WarpEffect` | Star Warsのハイパースペースジャンプのような光の筋効果 |
| `PlanetariumEffect` | プラネタリウム投影用の魚眼変形 |

### 時間依存エフェクト

| クラス名 | 説明 |
|---------|------|
| `AfterimageEffect` | 前フレームの残像を残す目眩のような効果 |
| `MotionBlurEffect` | 動きに応じたぼかし効果 |
| `TransitionEffect` | 2つの画像間のトランジション効果（dissolve, wipe, swirl, zoom, slide） |

## 使用例

### 基本的な使用方法

```typescript
import { Globe, GlowEffect } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
const globe = new Globe(container, {
  visualEffect: new GlowEffect()
});

// 動的にエフェクトを変更
globe.setVisualEffect(new WarpEffect());

// エフェクトを解除
globe.setVisualEffect(null);
```

### エフェクトのパラメータ調整

各エフェクトにはパラメータがあり、効果の強度などを調整できます。

```typescript
// グロー効果
const glow = new GlowEffect();
glow.intensity = 1.5;  // グローの強度
glow.threshold = 0.4;  // グローの閾値
glow.radius = 4.0;     // グローの拡散範囲
glow.aspectRatio = 1.0; // アスペクト比

// ガウシアンブラー
const blur = new GaussianBlurEffect();
blur.radius = 5.0;      // ぼかしの半径
blur.aspectRatio = 1.0; // アスペクト比

// ブルーム効果
const bloom = new BloomEffect();
bloom.blurRadius = 5.0;     // ブラーの半径
bloom.originalBlend = 1.0;  // 元画像のブレンド比率
bloom.blurBlend = 0.5;      // ブラーのブレンド比率
bloom.threshold = 0.3;      // 明るさの閾値

// 残像効果
const afterimage = new AfterimageEffect();
afterimage.decay = 0.85;      // 残像の減衰率（0-1）
afterimage.blend = 0.7;       // 残像のブレンド比率
afterimage.blurAmount = 0.0;  // 残像に適用するブラー量
```

`GlowEffect` と `BloomEffect` は「高輝度部分だけを強調する」後処理です。輪郭抽出や全画面の白飛びを狙うものではありません。天体画像では星像、白いマーカー、明るい銀河中心などを目立たせたい場面で使います。`threshold` を下げすぎると背景まで持ち上がって壊れたように見えやすいので注意してください。

### アニメーション対応エフェクト

一部のエフェクト（`RippleEffect`, `FrostedGlassEffect`）は `update()` を実装しており、`WarpEffect` は `startWarp()` / `endWarp()` の実行中に継続的な再描画が必要です。

```typescript
const ripple = new RippleEffect();
globe.setVisualEffect(ripple);

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

`WarpEffect` を使う場合は、強度アニメーション中も `globe.requestRefresh()` を継続して呼んでください。

```typescript
const warp = new WarpEffect();
globe.setVisualEffect(warp);

let active = true;
function redrawLoop() {
  if (!active) return;
  globe.requestRefresh();
  requestAnimationFrame(redrawLoop);
}

redrawLoop();
await warp.startWarp(1500);
await warp.endWarp(800);
active = false;
```

### トランジション効果

2つの画像間のトランジションを実現できます。使い方は次の4段階です。

1. `TransitionEffect` を `globe.setVisualEffect()` で有効化する
2. 現在の画面を `globe.captureVisualEffectSnapshot()` で保存する
3. カメラやレイヤーを変更して「遷移後」の状態を作る
4. `progress` を `0` から `1` に進めながら `globe.requestRefresh()` する

```typescript
import { Globe, TransitionEffect, SkyCoord, deg2rad } from '@stellar-globe/stellar-globe';

const transition = new TransitionEffect();
transition.type = 'swirl';  // 'dissolve' | 'wipe' | 'swirl' | 'zoom' | 'slide'
transition.progress = 0.0;  // 0: スナップショット, 1: 現在のフレーム
transition.swirlStrength = 3.0;  // 渦巻きの強度（swirlタイプ用）

globe.setVisualEffect(transition);
globe.captureVisualEffectSnapshot();

globe.camera.jumpTo(
  { fovy: deg2rad(20) },
  { coord: SkyCoord.fromDeg(10.6847083, 41.26875), duration: 0 },
);

const duration = 1500;
const startTime = performance.now();
function animateTransition() {
  const elapsed = performance.now() - startTime;
  transition.progress = Math.min(elapsed / duration, 1);
  globe.requestRefresh();
  if (transition.progress < 1) {
    requestAnimationFrame(animateTransition);
  } else {
    globe.clearVisualEffectSnapshot();
  }
}
animateTransition();
```

### ワープ効果のアニメーション

```typescript
const warp = new WarpEffect();
globe.setVisualEffect(warp);

// ワープ開始（1.5秒かけて）
await warp.startWarp(1500);

// ワープ終了（0.8秒かけて）
await warp.endWarp(800);
```

## カスタムエフェクトの作成

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

### 前フレームを使用するエフェクト

前フレームのテクスチャを使用するエフェクトを作成する場合は、`usesPreviousFrame` フラグを設定します。

```typescript
class MyAfterimageEffect extends VisualEffectParams {
  readonly usesPreviousFrame = true;
  
  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D u_raw;
      uniform sampler2D u_previous_frame;
      uniform mat2 u_tex_matrix;
      uniform float u_has_previous;
      varying vec2 v_coord;

      void main(void) {
        vec2 texCoord = u_tex_matrix * v_coord;
        vec4 current = texture2D(u_raw, texCoord);
        
        if (u_has_previous > 0.5) {
          vec4 previous = texture2D(u_previous_frame, texCoord);
          gl_FragColor = mix(previous, current, 0.5);
        } else {
          gl_FragColor = current;
        }
      }
    `;
  }

  setUniforms(program: Program) {}
}
```

### スナップショットを使用するエフェクト

スナップショットを使用するエフェクト（トランジション用）を作成する場合は、`usesSnapshot` フラグを設定します。

```typescript
class MyTransitionEffect extends VisualEffectParams {
  readonly usesSnapshot = true;
  progress = 0.0;
  
  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D u_raw;
      uniform sampler2D u_snapshot;
      uniform mat2 u_tex_matrix;
      uniform float u_progress;
      uniform float u_has_snapshot;
      varying vec2 v_coord;

      void main(void) {
        vec2 texCoord = u_tex_matrix * v_coord;
        vec4 current = texture2D(u_raw, texCoord);
        
        if (u_has_snapshot > 0.5) {
          vec4 snapshot = texture2D(u_snapshot, texCoord);
          gl_FragColor = mix(snapshot, current, u_progress);
        } else {
          gl_FragColor = current;
        }
      }
    `;
  }

  setUniforms(program: Program) {
    program.uniform1f({ u_progress: this.progress });
  }
}
```

## デモでのキーボードショートカット

| キー | エフェクト |
|------|-----------|
| `0` | エフェクトなし |
| `1` | グロー |
| `2` | すりガラス |
| `3` | 波紋 |
| `4` | ワープ |
| `5` | プラネタリウム |
| `6` | ガウシアンブラー |
| `7` | ブルーム |
| `8` | 残像 |
| `9` | トランジション |
| `W` | ワープ効果の開始/終了（アニメーション中は連続再描画） |
| `T` | 現在の画面を保存し、次の視点へトランジション |
