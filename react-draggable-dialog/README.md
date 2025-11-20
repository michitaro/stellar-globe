# @stellar-globe/react-draggable-dialog

React component library providing draggable and resizable dialog boxes.
Used for building UI in `stellar-globe` applications, but can also be used independently.

## Purpose

* Provide a draggable window system
* Manage window stacking order (Z-index)
* Resize functionality

## Usage

Wrap the entire application (or the region where you want to display dialogs) with `DialogContext`, and use the `Dialog` component within it.

```tsx
import { DialogContext, Dialog } from "@stellar-globe/react-draggable-dialog";
import "@stellar-globe/react-draggable-dialog/style.css"; // Style import required

function App() {
  return (
    <DialogContext>
      <Dialog title="Sample Dialog" initialPosition={{ x: 100, y: 100 }}>
        <p>Dialog content goes here.</p>
      </Dialog>
    </DialogContext>
  );
}
```

## Key Components

### `DialogContext`
Context provider that manages dialog state (position, size, focus, etc.).
Controls the stacking order among multiple dialogs.

### `Dialog`
Basic dialog component.
Supports drag movement via title bar and resizing via edges.

### `DarkDialog`
Style variation of `Dialog` (for dark theme).

## Running Sample Code

Start the development server and run sample code with the following commands:

```bash
npm install
npm run dev
```

Access `http://localhost:5173/` in your browser to view the sample.
Sample code is included in `example/Example.tsx`.

## Generating API Documentation

You can generate API documentation using TypeDoc.

```bash
npm run typedoc
```

The generated documentation will be output to the `docs` directory.

## Running Sample Code

Start the development server and run sample code with the following commands:

```bash
npm install
npm run dev
```
