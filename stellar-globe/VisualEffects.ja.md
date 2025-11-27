# ビジュアルエフェクト詳細ドキュメント

`VisualEffectParams` を継承したクラスを使用して、描画に後処理エフェクトを適用できます。

## 利用可能なエフェクト

### 基本エフェクト

| クラス名 | 説明 |
|---------|------|
| `GlowEffect` | 明るい部分を光らせるグロー効果 |
| `GaussianBlurEffect` | ガウシアンぼかし効果 |
| `BloomEffect` | 元画像とブラーを合成するブルーム効果 |
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

### アニメーション対応エフェクト

一部のエフェクト（`RippleEffect`, `FrostedGlassEffect`）はアニメーションに対応しています。

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

### トランジション効果

2つの画像間のトランジションを実現できます。

```typescript
const transition = new TransitionEffect();
transition.type = 'swirl';  // 'dissolve' | 'wipe' | 'swirl' | 'zoom' | 'slide'
transition.progress = 0.5;  // 0: スナップショット, 1: 現在のフレーム
transition.swirlStrength = 3.0;  // 渦巻きの強度（swirlタイプ用）

globe.setVisualEffect(transition);
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
| `W` | ワープ効果の開始/終了 |
| `T` | トランジションデモ |
