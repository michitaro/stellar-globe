# Visual Effects Detailed Documentation

You can apply post-processing effects to rendering by using classes that extend `VisualEffectParams`.

## Available Effects

### Basic Effects

| Class Name | Description |
|------------|-------------|
| `GlowEffect` | Glow effect that makes bright areas shine |
| `GaussianBlurEffect` | Gaussian blur effect |
| `BloomEffect` | Bloom effect combining original image with blur |
| `FrostedGlassEffect` | Frosted glass blur effect |
| `PassThroughEffect` | No effect pass-through (for debugging) |

### Distortion Effects

| Class Name | Description |
|------------|-------------|
| `RippleEffect` | Water ripple distortion effect (animation supported) |
| `WarpEffect` | Star Wars hyperspace jump light streak effect |
| `PlanetariumEffect` | Fisheye distortion for planetarium projection |

### Time-Dependent Effects

| Class Name | Description |
|------------|-------------|
| `AfterimageEffect` | Dizziness-like afterimage effect from previous frame |
| `MotionBlurEffect` | Motion-dependent blur effect |
| `TransitionEffect` | Transition effect between two images (dissolve, wipe, swirl, zoom, slide) |

## Usage Examples

### Basic Usage

```typescript
import { Globe, GlowEffect } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
const globe = new Globe(container, {
  visualEffect: new GlowEffect()
});

// Change effect dynamically
globe.setVisualEffect(new WarpEffect());

// Remove effect
globe.setVisualEffect(null);
```

### Adjusting Effect Parameters

Each effect has parameters that allow you to adjust intensity and other properties.

```typescript
// Glow effect
const glow = new GlowEffect();
glow.intensity = 1.5;  // Glow intensity
glow.threshold = 0.4;  // Glow threshold
glow.radius = 4.0;     // Glow spread range
glow.aspectRatio = 1.0; // Aspect ratio

// Gaussian blur
const blur = new GaussianBlurEffect();
blur.radius = 5.0;      // Blur radius
blur.aspectRatio = 1.0; // Aspect ratio

// Bloom effect
const bloom = new BloomEffect();
bloom.blurRadius = 5.0;     // Blur radius
bloom.originalBlend = 1.0;  // Original image blend ratio
bloom.blurBlend = 0.5;      // Blur blend ratio
bloom.threshold = 0.3;      // Brightness threshold

// Afterimage effect
const afterimage = new AfterimageEffect();
afterimage.decay = 0.85;      // Afterimage decay rate (0-1)
afterimage.blend = 0.7;       // Afterimage blend ratio
afterimage.blurAmount = 0.0;  // Blur amount applied to afterimage
```

### Animation-Enabled Effects

Some effects (`RippleEffect`, `FrostedGlassEffect`) support animation.

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

### Transition Effect

You can achieve transitions between two images.

```typescript
const transition = new TransitionEffect();
transition.type = 'swirl';  // 'dissolve' | 'wipe' | 'swirl' | 'zoom' | 'slide'
transition.progress = 0.5;  // 0: snapshot, 1: current frame
transition.swirlStrength = 3.0;  // Swirl intensity (for swirl type)

globe.setVisualEffect(transition);
```

### Warp Effect Animation

```typescript
const warp = new WarpEffect();
globe.setVisualEffect(warp);

// Start warp (over 1.5 seconds)
await warp.startWarp(1500);

// End warp (over 0.8 seconds)
await warp.endWarp(800);
```

## Creating Custom Effects

You can create custom effects by extending `VisualEffectParams`.

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

### Effects Using Previous Frame

To create an effect that uses the previous frame texture, set the `usesPreviousFrame` flag.

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

### Effects Using Snapshot

To create an effect using a snapshot (for transitions), set the `usesSnapshot` flag.

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

## Demo Keyboard Shortcuts

| Key | Effect |
|-----|--------|
| `0` | No effect |
| `1` | Glow |
| `2` | Frosted Glass |
| `3` | Ripple |
| `4` | Warp |
| `5` | Planetarium |
| `6` | Gaussian Blur |
| `7` | Bloom |
| `8` | Afterimage |
| `9` | Transition |
| `W` | Start/end warp effect |
| `T` | Transition demo |
