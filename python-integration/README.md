# Python Integration

Tools for using and controlling Stellar Globe (hscMap) from Python environments.

## Component Structure

### `python` (hscmap)

A client library for operating the viewer from Python.
Used as a widget in JupyterLab or to control a remote viewer.

This library uses Jupyter Comm (a bidirectional communication channel between Jupyter kernel and frontend)
to send messages from Python code to the hscMap application.

### `jupyterlab-extension`

An extension for JupyterLab.
Provides functionality to display hscMap in a JupyterLab tab and communicate with the Python kernel.

#### What is a Jupyter Extension

JupyterLab has a plugin architecture that allows adding functionality through extensions.
Extensions mainly consist of the following elements:

1. **Frontend part** (TypeScript/React)
   - Components integrated into JupyterLab UI
   - Add UI elements such as tabs, sidebars, and menus
   - In this project, implements a React widget that displays hscMap in an iframe

2. **Communication layer** (Jupyter Comm)
   - Bidirectional communication between Python kernel and frontend
   - Uses `ipykernel.comm` (Python side) and `@jupyterlab/services` (TypeScript side)
   - Can send and receive any JSON-serializable messages

3. **Packaging**
   - Python package (pip installable)
   - npm package (frontend code)
   - Distributed as an integrated package containing both

#### Implementation in This Project

`jupyterlab-extension` serves the following roles:

1. **Monitor Comm**
   - Monitor for creation of Comm named `stellar-globe`
   - Comm is created when `hscmap.Window()` is called on Python side

2. **Widget generation**
   - When Comm is detected, open hscMap application in a new tab
   - Render `@stellar-globe/app` as a React component

3. **Message relay**
   - Receive messages from Python side (`ToApp` type) and forward to app in iframe
   - Receive messages from App side (`FromApp` type) and forward to Python via Comm
   - Messages are type-checked to ensure compliance with JSON Schema

4. **State synchronization**
   - Monitor changes to App's Redux store
   - Calculate differences in JSON Patch format and efficiently synchronize with Python side
   - `jupyterlab-extension/packages/jupyterlab-bridge/` absorbs JupyterLab version differences and Comm lifecycle handling

### `hscmap-server`

A server application for distributing and controlling hscMap as a standalone web server without using JupyterLab. Start it from the command line, for example with `hscmap-server --port 8000`, to serve the Stellar Globe frontend on the requested port.

It connects to the Python client over WebSocket and relays Python commands and browser state updates. Use it when you want to use hscMap without a Jupyter environment or embed it in your own web application.

## Usage

### Using in JupyterLab

```bash
pip install hscmap
jupyter labextension install @stellar-globe/jupyterlab-extension
```

Python code example:

```python
import hscmap

# Open a window
w = hscmap.Window()

# Jump to specified coordinates
w.jump_to(ra=180, dec=0, fov=1)
```
