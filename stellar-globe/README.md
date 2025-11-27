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

```typescript
import { Globe, GlowEffect } from '@stellar-globe/stellar-globe';

const globe = new Globe(container, {
  visualEffect: new GlowEffect()
});

// Change effect dynamically
globe.setVisualEffect(new WarpEffect());

// Remove effect
globe.setVisualEffect(null);
```

Available effects: `GlowEffect`, `GaussianBlurEffect`, `BloomEffect`, `FrostedGlassEffect`, `RippleEffect`, `WarpEffect`, `PlanetariumEffect`, `AfterimageEffect`, `TransitionEffect`, etc.

For details, see [Visual Effects Detailed Documentation](./VisualEffects.md).

## Running the Demo

Sample code is available in the `demo` directory.
Start the development server with the following commands to run the demo:

```bash
cd stellar-globe
npm install
npm run dev
```

Access `http://localhost:5173/demo/` in your browser to view the demo.

## Generating API Documentation

You can generate API documentation using TypeDoc.

```bash
npm run typedoc
```

The generated documentation will be output to the `docs` directory.
