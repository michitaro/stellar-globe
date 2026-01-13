# @stellar-globe/react-stellar-globe

Wrapper library for using `stellar-globe` from React applications.
Enables building all-sky viewers with declarative JSX syntax.

## Purpose

* Provide `stellar-globe` as React components
* Declarative layer management
* Integration with React state management

## Usage

Use the `Globe` component as the root, and place various layer components as its children.

```tsx
import { Globe, PanLayer, ZoomLayer } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Globe>
        <PanLayer />
        <ZoomLayer />
        {/* Other layers */}
      </Globe>
    </div>
  );
}
```

## Key Components

### `Globe`
Component that serves as the viewer container. Internally creates and manages the `stellar-globe` `Globe` instance.

### Layer Components
React components corresponding to each layer in `stellar-globe`.
* `TractTileLayer`: Tile image layer
* `PanLayer`, `ZoomLayer`, `RollLayer`: Operation layers
* `GridLayer`: Grid layer
* `ConstellationLayer`: Constellation layer
* `MarkerLayer`: Marker layer

### Hooks
* `useGetGlobe`: Hook for accessing the `Globe` instance.

## Running Sample Code

Start the development server and run sample code with the following commands:

```bash
npm install
npm run dev
```

Access `http://localhost:5173/examples/` in your browser to view the sample list.
`examples/BasicUsage/` contains basic usage examples.

## Generating API Documentation

You can generate API documentation using TypeDoc.

```bash
npm run typedoc
```

The generated documentation will be output to the `docs` directory.
