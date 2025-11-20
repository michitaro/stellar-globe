# JupyterLite Build

This directory is for building a standalone Stellar Globe (hscMap) environment running in the browser using JupyterLite.

## Overview

JupyterLite is a project that runs JupyterLab completely in the browser using WebAssembly (WASM).
This directory builds a JupyterLite environment including:

- hscMap Python client library
- stellar-globe JupyterLab extension
- Tutorial notebook

The built site consists of entirely static files and can be hosted on any web server or GitHub Pages
without requiring server-side Python or Jupyter server.

## Directory Structure

```
jupyterlite/
├── files/          # Files to include in JupyterLite during build
│   └── tutorial.ipynb  # hscMap tutorial notebook
├── pypi/           # Python packages installable in JupyterLite
│   └── hscmap-0.0.0-py3-none-any.whl
├── _output/        # Build output (static site)
├── pyproject.toml  # Python environment configuration
├── Makefile        # Build commands
└── README.md       # This file
```

## Prerequisites

- Python 3.8 or later
- uv command (Python environment manager)

Installing uv:
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# or via Homebrew
brew install uv
```

## Environment Setup

### 1. Setup Development Environment

```bash
make setup
```

This command:
- Installs required Python packages with `uv sync --dev`
  - jupyterlab
  - jupyterlite-core
  - jupyterlite-pyodide-kernel

### 2. Build Dependencies

To include hscMap in JupyterLite, you need to build the following packages first:

```bash
# Build app library version
make -C ../../app lib

# Build hscMap Python client library
make -C ../python build

# Build JupyterLab extension
make -C ../jupyterlab-extension build
```

Or using Makefile target:
```bash
make rebuild-dependencies
```

## Building

### Full Rebuild

Rebuild everything including dependencies:

```bash
make rebuild
```

This command:
1. `rebuild-dependencies`: Build dependency packages
2. `build`: Build JupyterLite site
   - Copy hscMap wheel to `pypi/` directory
   - Copy tutorial notebook to `files/` directory
   - Install JupyterLab extension
   - Run `jupyter lite build` to generate site

### Build Only

If dependencies are already built:

```bash
make build
```

## Local Testing

After building, start a local server to run JupyterLite:

```bash
make serve
```

Access `http://localhost:8000` in your browser to open JupyterLite.

### Testing Steps

1. Start server: `make serve`
2. Access in browser
3. Open `tutorial.ipynb` from file browser
4. Run cells to verify hscMap functionality

## Deployment

Upload the built site to deployment server:

```bash
make deploy
```

This deploys the contents of `_output/` directory to `hscmap.mtk.nao.ac.jp:htdocs/hscMap5/jupyter/`.

## Troubleshooting

### Build Errors

**Error: `jupyter lite build` fails**

Check the following:
- Are dependencies built correctly?
  ```bash
  ls ../python/dist/hscmap-0.0.0-py3-none-any.whl
  ls ../jupyterlab-extension/dist/
  ```
- Is JupyterLab extension installed correctly?
  ```bash
  uv run jupyter labextension list
  ```

**Error: Package not found**

Verify wheel file exists in `pypi/` directory:
```bash
ls pypi/
```

If not, build python package first:
```bash
make rebuild-python
```

### Runtime Errors

**Error: hscMap doesn't work in notebook**

1. Check error messages in browser console
2. Verify JupyterLab extension loaded correctly
3. Do full rebuild if needed: `make rebuild`

## About JupyterLite

JupyterLite is a WebAssembly version of Jupyter with these features:

- **Serverless**: Python interpreter runs in browser
- **Fast startup**: No server-side processing needed
- **Easy deployment**: Just host static files
- **Offline capable**: No internet required (after initial load)

However, there are limitations:
- Only packages supported by Pyodide work
- File I/O is limited
- Some native extensions won't work

See [JupyterLite official documentation](https://jupyterlite.readthedocs.io/) for details.

## References

- [JupyterLite](https://jupyterlite.readthedocs.io/)
- [Pyodide](https://pyodide.org/)
- [hscMap Python Client](../python/)
- [hscMap JupyterLab Extension](../jupyterlab-extension/)

