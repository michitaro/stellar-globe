# stellar_globe_jupyterlab_extension

Package for displaying Stellar Globe (HSC Map) in JupyterLab tabs as a JupyterLab extension.

## Purpose

* Display HSC Map in JupyterLab tabs
* Realize communication between Python kernel and HSC Map via Jupyter Comm
* Provide integrated environment for data analysis and visualization

## Requirements

- JupyterLab >= 4.0.0

## Installation

```bash
pip install stellar_globe_jupyterlab_extension
```

## Package Structure

### TypeScript side (`src/`)

* `StellarGlobeWidget.tsx`: Main React widget. Displays HSC Map application in iframe
* `index.ts`: JupyterLab extension entry point
* `types.ts`: Type definitions
* `eventemitter.ts`: Event handling
* `lockWindow.tsx`: Window lock functionality

### Python side (`stellar_globe_jupyterlab_extension/`)

* `__init__.py`: Python extension initialization
* `labextension/`: Built JavaScript/CSS files (for distribution)

### Communication Mechanism

1. Calling `hscmap.Window()` on Python side creates a Jupyter Comm
2. JupyterLab extension detects Comm and opens HSC Map in a new tab
3. Messages are exchanged between Python↔HSC Map via Comm

## Development Procedure

### Setting Up Development Environment

Node.js is required.

```bash
# Clone repository
git clone <repository>
cd python-integration/jupyterlab-extension

# Install in development mode
pip install -e "."

# Link with JupyterLab
jupyter labextension develop . --overwrite

# Build TypeScript source
jlpm build
```

### Starting Development Server

To automatically rebuild on source code changes:

```bash
# Terminal 1: Watch source and auto-rebuild
jlpm watch

# Terminal 2: Start JupyterLab
jupyter lab
```

When running `jlpm watch` during development, files are automatically rebuilt on save, and changes are reflected by refreshing JupyterLab.

### Debugging

To build with source maps enabled:

```bash
jupyter lab build --minimize=False
```

This makes debugging easier in browser developer tools.

### Uninstalling Development Mode

```bash
pip uninstall stellar_globe_jupyterlab_extension
```

You also need to remove the `@stellar-globe/jupyterlab-extension` symbolic link in the `labextensions` folder, which can be confirmed with `jupyter labextension list`.

## Packaging

For release procedures, refer to [RELEASE.md](RELEASE.md).
