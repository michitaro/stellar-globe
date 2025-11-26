# @stellar-globe/stellar-globe

Core library of the Stellar Globe project.
Provides an all-sky rendering engine using WebGL.

## Purpose

* High-speed all-sky rendering (using WebGL)
* Display of hierarchical tile images (HSC Map, HiPS)
* Coordinate transformation and camera control
* Extensibility through various layers

## Usage

The `Globe` class is the entry point.
Initialize `Globe` by specifying an HTML element and add the necessary layers.

```typescript
import { Globe, SspTileLayer } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
if (container) {
  const globe = new Globe(container);
  
  // Example of adding layers
  // globe.addLayer(new SspTileLayer(...));
}
```

## Key Classes and Functions

### `Globe`
The main viewer component. Manages canvas elements, rendering loop, and layers.

### `Layer`
Base class representing layers on the map.
Includes the following subclasses:
* `SspTileLayer`: Layer for displaying tile images in HSC Map format.
* `PanLayer`, `ZoomLayer`, `RollLayer`: Layers providing viewport navigation through mouse operations.
* `GridLayer`: Layer for displaying coordinate grids.
* `ConstellationLayer`: Layer for displaying constellation lines.

### `SkyCoord`
Class for handling coordinates on the celestial sphere. Manages right ascension, declination, etc.

### `Angle`
Utility class for handling angles. Performs conversions between degrees, radians, hour angles, etc.

## Visual Effects

You can apply post-processing effects to rendering by using classes that extend `VisualEffectParams`.

### Available Effects

| Class Name | Description |
|------------|-------------|
| `GlowEffect` | Glow/bloom effect that makes bright areas shine |
| `FrostedGlassEffect` | Frosted glass blur effect |
| `RippleEffect` | Water ripple distortion effect (animation supported) |
| `WarpEffect` | Star Wars hyperspace jump light streak effect |
| `PlanetariumEffect` | Fisheye distortion for planetarium projection |
| `PassThroughEffect` | No effect pass-through (for debugging) |

### Usage Example

```typescript
import { Globe, GlowEffect, WarpEffect } from '@stellar-globe/stellar-globe';

const container = document.getElementById('container');
const globe = new Globe(container, {
  // Specify effect in constructor
  visualEffect: new GlowEffect()
});

// Or change effect dynamically
globe.setVisualEffect(new WarpEffect());

// Remove effect
globe.setVisualEffect(null);
```

### Adjusting Effect Parameters

Each effect has parameters that allow you to adjust intensity and other properties.

```typescript
const glow = new GlowEffect();
glow.intensity = 1.5;  // Glow intensity
glow.threshold = 0.4;  // Glow threshold
glow.radius = 4.0;     // Glow spread range

globe.setVisualEffect(glow);
```

### Animation-Enabled Effects

Some effects (`RippleEffect`, `FrostedGlassEffect`) support animation.
Call the `update(deltaTime)` method to achieve time-based changes.

```typescript
const ripple = new RippleEffect();
globe.setVisualEffect(ripple);

// Animation loop
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

### Creating Custom Effects

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
        // Add custom processing here
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

## Running the Demo

Sample code is available in the `demo` directory.
Start the development server with the following commands to run the demo:

```bash
cd stellar-globe
npm install
npm run dev
```

Access `http://localhost:5173/demo/` in your browser to view the demo.

### Visual Effects Demo

On the demo page, you can switch effects using the following keyboard shortcuts:

| Key | Effect |
|-----|--------|
| `0` | No effect |
| `1` | Glow |
| `2` | Frosted Glass |
| `3` | Ripple |
| `4` | Warp |
| `5` | Planetarium |
| `W` | Start/end warp effect |

## Generating API Documentation

You can generate API documentation using TypeDoc.

```bash
npm run typedoc
```

The generated documentation will be output to the `docs` directory.
