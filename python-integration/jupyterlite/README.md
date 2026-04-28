# JupyterLite Build

This directory is for building a standalone Stellar Globe (hscMap) environment running in the browser using JupyterLite.

## Overview

JupyterLite is a project that runs JupyterLab completely in the browser using WebAssembly (WASM).
This directory builds a JupyterLite environment including:

- hscMap Python client library
- stellar-globe JupyterLab extension
- Tutorial notebook
- Smoke notebook for E2E

The built site consists of entirely static files and can be hosted on any web server or GitHub Pages
without requiring server-side Python or Jupyter server.

## Directory Structure

```
jupyterlite/
├── content/        # Additional notebooks bundled into JupyterLite
│   └── e2e-smoke.ipynb  # Smoke notebook for Playwright
├── files/          # Files included in JupyterLite during build (generated)
│   ├── tutorial.ipynb
│   └── e2e-smoke.ipynb
├── pypi/           # Python packages installable in JupyterLite
│   └── hscmap-0.0.0-py3-none-any.whl
├── _output/        # Build output (static site)
├── tests/          # Playwright tests
├── scripts/        # Docker wrapper scripts
├── package.json    # Playwright package definition
├── pyproject.toml  # Python environment configuration
├── Makefile        # Build commands
└── README.md       # This file
```

## Prerequisites

- Python 3.8 or later
- uv command (Python environment manager)
- Node.js 18 or later (for E2E)
- Docker (when using `npm run test:e2e:docker`)

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
   - Copy tutorial and E2E notebooks to `files/` directory
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

### Serve prebuilt output only

For E2E, you can serve `_output/` without triggering a rebuild:

```bash
make serve-built
```

`serve-built` adds the cross-origin isolation headers needed for reliable JupyterLite file synchronization.

## Playwright E2E Tests

### Setup

```bash
npm install
npm run setup:e2e
```

### Run locally

```bash
npm run test:e2e:noninteractive
```

This command will:

1. Run `make rebuild` to rebuild JupyterLite and its dependencies
2. Serve the static site on `127.0.0.1:8000` via `make serve-built`
3. Open and run `e2e-smoke.ipynb` with Playwright + Chromium

The smoke test checks:

- a notebook can be opened
- `hscmap` can be imported in JupyterLite
- the viewer can be opened
- camera state can be updated
- the viewer `canvas` is rendered

### Run in Docker

```bash
npm run test:e2e:docker
```

This uses the official Playwright Docker image. On Linux it runs with `--network host --ipc=host --init`.
JupyterLite file synchronization depends on either `SharedArrayBuffer` or the Service Worker, so `serve-built` uses a static server with cross-origin isolation headers. The Docker runner also keeps access on `127.0.0.1` instead of routing through a container alias so the Service Worker path remains valid.

### Limitations

- The Docker wrapper currently assumes Linux
- WebGL runs through Chromium software rendering (`SwiftShader`)
- The initial test is a smoke test for startup, state sync, and snapshot generation rather than pixel-perfect comparison

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
