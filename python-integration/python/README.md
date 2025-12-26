# Python Integration - hscmap/stellarglobe

A client library for operating the Stellar Globe (hscMap) application from Python environments.

## Purpose

* Control hscMap from Python (especially in Jupyter environments)
* Achieve type-safe communication
* Integrate data visualization and analysis

## Installation

```bash
pip install hscmap
```

Or development version:

```bash
git clone <repository>
cd python-integration/python
make setup
```

## Package Structure

### `src/hscmap/`
Main package directory. Provides communication functionality with hscMap.

Main modules:
* `window.py`: Window (viewer instance) management
* `comm.py`: Jupyter Comm communication implementation
* `types.py`: Type definitions
* `validators.py`: Message validation

### `src/stellarglobe/`
General astronomical calculations and utilities (for future extensions)

### `tests/`
Test code using pytest

### `docs/`
Sphinx documentation source

## Type Checking Mechanism for Integration with app

To maintain type consistency between Python and TypeScript (`app`) sides, the following mechanism is implemented.

### Mechanism

1. **Common JSON Schema**: Use JSON Schema generated on the `app` side
   * Load `app/jsonschema/public.json` on Python side
   
2. **Automatic data model generation**: 
   Automatically generate Python type-hinted dataclasses from `app/jsonschema/public.json`.
   Uses the `datamodel-code-generator` library to generate TypedDict-based dataclasses from JSON Schema.
   ```bash
   make datamodel
   ```
   This command generates models under the `src/hscmap/models/` directory.
   For example, `src/hscmap/models/actions/catalogs/catalogAdded.py` contains
   the payload type for the `catalogAdded` action.

3. **Runtime validation**: 
   Validate sent and received messages using the `jsonschema` library.
   * Python→app: Validate in `validators.py` before sending messages
   * app→Python: Validate when receiving messages
   
   Validation uses `jsonschema.validate()` function for strict checking compliant with JSON Schema specification.

### Type Checking on app Side

On the app side, runtime validation is performed using the `ajv` library (Another JSON Schema Validator)
based on the same JSON Schema.
See `app/README.ja.md` for details.

### Procedure to Maintain Type Consistency

1. Update types in `app/types/commTools/index.d.ts`
2. Run `npm run refresh-types` in `app` to regenerate JSON Schema
3. Run `make datamodel` in `python-integration/python` to regenerate Python types
4. Update Python code to use new types

## Testing

This project uses `pytest` to run tests.
Tests are located in the `tests/` directory and coverage reports are also generated.

### Running Tests

Basic test execution (after setting up development environment):
```bash
make test
```

This is equivalent to:
```bash
pytest --cov=hscmap --cov-report=html --ff -x -s tests
```

Option descriptions:
* `--cov=hscmap`: Measure coverage of `hscmap` package
* `--cov-report=html`: Generate HTML report in `htmlcov/`
* `--ff`: Run previously failed tests first
* `-x`: Stop at first failure
* `-s`: Display print statement output

### Watch Mode

Automatically rerun tests when files change:
```bash
make test-watch
```

### Test Markers

Test markers are defined in `pytest.ini`:
* `slow`: Tests that take time to run (skipped by default)
* `hot`: Tests under development

To run tests marked as slow:
```bash
pytest -m "" tests
```

Run only specific markers:
```bash
pytest -m "hot" tests
```

### Coverage Report

After running tests, open `htmlcov/index.html` in a browser
to view coverage visually.

## Development Tools

### Development Environment Setup

Create virtual environment and install dependencies:
```bash
make setup
```

This command:
1. Create virtual environment in `.venv` directory
2. Update pip to latest version
3. Install this package in development mode (`-e`)
4. Install development dependencies (pytest, pyright, etc.)

### Type Checking

Run static type checking using Pyright installed via uv:
```bash
make typecheck
```

Watch mode to monitor file changes:
```bash
make typecheck-watch
```

Pyright is a fast Python type checker developed by Microsoft,
configured in `pyrightconfig.json`.

### Data Model Generation

Auto-generate Python data models from `app/jsonschema/public.json`:
```bash
make datamodel
```

This command:
1. Generate JSON Schema in `app` directory if needed
2. Run `datamodel-code-generator` to generate type-hinted classes
3. Place generated code in `src/hscmap/models/` directory

Examples of generated files:
- `src/hscmap/models/actions/catalogs/catalogAdded.py`: Catalog add action type
- `src/hscmap/models/store.py`: Redux Store state type
- `src/hscmap/models/frontend/Ready.py`: app→Python message type

### Build

Build distribution packages (wheel and tar.gz):
```bash
make build
```

Generated packages are placed in `dist/` directory.

### Deploy

Upload built packages to deployment server:
```bash
make deploy
```

This uploads packages to `hscmap.mtk.nao.ac.jp` server.

## Deployment Destination

The following files are placed under `https://hscmap.mtk.nao.ac.jp/hscMap5/`:

* `app/`: HSC Map application main body
* `jupyter/`: JupyterLab extension
* `python/`: Python client library
