# Python Integration - hscmap/stellarglobe

Client library for controlling Stellar Globe (HSC Map) application from Python environments.

## Purpose

* Control HSC Map from Python (especially Jupyter environments)
* Achieve type-safe communication
* Integration of data visualization and analysis

## Installation

```bash
pip install hscmap
```

Or for development version:

```bash
git clone <repository>
cd python-integration/python
make setup
```

## Package Structure

### `src/hscmap/`
Main package directory. Provides communication functionality with HSC Map.

Key modules:
* `window.py`: Window (viewer instance) management
* `comm.py`: Jupyter Comm communication implementation
* `types.py`: Type definitions
* `validators.py`: Message validation

### `src/stellarglobe/`
General astronomical calculations and utilities (for future extensions)

### `tests/`
Test code using pytest

### `docs/`
Documentation source using Sphinx

## Type Checking Mechanism for Integration with app

To maintain type consistency between Python and TypeScript (app), the following mechanism is implemented.

### Mechanism

1. **Common JSON Schema**: Use JSON Schema generated on the `app` side
   * Load `app/jsonschema/public.json` on Python side
   
2. **Automatic Data Model Generation**: 
   ```bash
   make datamodel
   ```
   This command generates Python dataclasses with type hints from `app/jsonschema/public.json`

3. **Runtime Validation**: Validate sent and received messages using the `jsonschema` library
   * Python→app: Validate before sending message
   * app→Python: Validate when receiving message

### Type Checking on app Side

For type checking on the app side, refer to `app/README.md`.

### Procedure to Maintain Type Consistency

1. Update types in `app/types/commTools/index.d.ts`
2. Run `npm run refresh-types` in `app`
3. Run `make datamodel` in `python-integration/python` to regenerate Python types
4. Update Python code to use new types

## Makefile Target Descriptions

### `make setup`
Set up development environment. Creates virtual environment and installs dependencies.

### `make test`
Run pytest to execute tests. Coverage reports are also generated.

### `make test-watch`
Run tests in watch mode. Automatically re-runs on file changes.

### `make datamodel`
Automatically generate Python data models from `app/jsonschema/public.json`.

### `make typecheck`
Perform type checking using Pyright.

### `make typecheck-watch`
Run type checking in watch mode.

### `make build`
Build distribution packages (wheel, tar.gz).

### `make deploy`
Upload built packages to deployment server.

## Deployment Destination

The following files are placed under `https://hscmap.mtk.nao.ac.jp/hscMap5/`:

* `app/`: HSC Map application main body
* `jupyter/`: JupyterLab extension
* `python/`: Python package
  * `notebooks/`: Tutorial notebooks
  * `docs/`: Sphinx documentation
  * `dist/`: Distribution packages
