# stellar_globe_jupyterlab_extension

A package to display Stellar Globe (hscMap) in JupyterLab tabs as a JupyterLab extension.

## Purpose

* Display hscMap in JupyterLab tabs
* Enable communication between Python kernel and hscMap using Jupyter Comm
* Provide an integrated environment for data analysis and visualization

## Requirements

- JupyterLab >= 4.0.0

## Installation

```bash
pip install stellar_globe_jupyterlab_extension
```

## Package Structure

### TypeScript Side (`src/`)

* `StellarGlobeWidget.tsx`: Main React widget. Displays hscMap application in iframe
* `index.ts`: Entry point for JupyterLab extension
* `types.ts`: Type definitions
* `eventemitter.ts`: Event handling
* `lockWindow.tsx`: Window lock functionality

### Python Side (`stellar_globe_jupyterlab_extension/`)

* `__init__.py`: Python extension initialization
* `labextension/`: Built JavaScript/CSS files (for distribution)

### Communication Mechanism

1. When `hscmap.Window()` is called on Python side, Jupyter Comm is created
2. JupyterLab extension detects Comm and opens hscMap in a new tab
3. Messages are exchanged between Python↔hscMap via Comm

## Details of Relay Between Python Process and app

This extension is responsible for relaying messages between the Python kernel and the `@stellar-globe/app` running in an iframe.

### Architecture Overview

```
Python Kernel (ipykernel)
    ↕ Jupyter Comm
JupyterLab Extension (TypeScript)
    ↕ AppHandle API
App in iframe (@stellar-globe/app)
```

### Startup Flow

1. **Comm Creation (Python side)**
   ```python
   # From hscmap library
   window = hscmap.Window()
   ```
   This creates a Jupyter Comm named `stellar-globe`.

2. **Comm Detection (Extension side)**
   - `activateCommPlugin()` in `src/index.ts` monitors all Comms
   - Calls `makeStellarGlobeWidget()` when it detects a Comm named `stellar-globe`

3. **Widget Generation**
   - Generate new React widget in `StellarGlobeWidget.tsx`
   - Render `@stellar-globe/app` in iframe
   - Display as JupyterLab tab

4. **Initialization Complete Notification**
   - When `AppHandle` `ref` is set, `useLayoutEffect` executes
   - Send `FromApp.Ready` message to Python side
   - Includes current state and revision number

### Message Relay (Python → app)

1. **Sending from Python side**
   ```python
   window.jump_to(ra=180, dec=0, fov=1)
   ```
   Internally sends `ToApp.JumpTo` message to Comm

2. **Reception in Extension**
   - `onMsgFromPython()` function receives messages via Comm
   - Implemented in `src/StellarGlobeWidget.tsx`

3. **Type Checking**
   ```typescript
   const { errors } = validateToAppMessage(type, message)
   ```
   Uses `validateToAppMessage()` from `@stellar-globe/app/commTools`
   Performs runtime validation based on JSON Schema

4. **Processing by Message Type**
   - `Dispatch`: Call `appHandle.dispatchAction()` to dispatch Redux action
   - `JumpTo`: (Special action implemented via Dispatch)
   - `ShowError`: Call JupyterLab's `showErrorMessage()`
   - `Close`: Close widget
   - `QueryState`: Query current state (described later)
   - Others: Window lock, title update, etc.

5. **Processing in app**
   - For Redux actions, processed through normal Redux flow
   - Store is updated and React components re-render

### Message Relay (app → Python)

1. **State Change Detection**
   ```typescript
   const onStoreChange: OnStoreChange = ({ state }) => {
     const patch = stateManager.pushState(state)
     sendMsgToJupyter(comm, 'StoreChanged', patch)
   }
   ```
   Detected by `onStoreChange` callback in `@stellar-globe/app`

2. **Difference Calculation**
   - `StateManager` class maintains state history
   - Add new state with `pushState()` and generate JSON Patch
   - Represent difference in JSON Patch (RFC 6902) format

3. **Sending to Comm**
   ```typescript
   sendMsgToJupyter(comm, 'StoreChanged', patch)
   ```
   Send as `FromApp.StoreChanged` message
   - `baseRevision`: Base revision for the difference
   - `patch`: Difference in JSON Patch format

4. **Reception on Python Side**
   - `hscmap.Window` class receives `FromApp` message
   - Apply JSON Patch to update state
   - Execute registered callbacks

### State Synchronization and Query

To handle network delays and message loss, a query function is implemented.

1. **State Query (Python → app)**
   ```python
   # From Python side
   state = window.query_state()
   ```
   Sends `ToApp.QueryState` message:
   ```typescript
   { queryId: "...", baseRevision: 123 }
   ```

2. **Processing in Extension**
   ```typescript
   QueryState: async ({ queryId, baseRevision }) => {
     const batchPatch = stateManager().patchFrom(baseRevision)
     await typedRespondToQuery('QueryStateResponse', queryId, batchPatch)
   }
   ```
   - Calculate difference from specified revision with `StateManager.patchFrom()`
   - If revision is too old and not in history, return complete state

3. **Reception on Python Side**
   - Receive `FromApp.QueryStateResponse` message
   - Apply difference or complete state
   - Promise resolves and returns result to caller

### Error Handling

1. **Type Check Errors**
   - If message doesn't conform to type definition, display alert
   - Output error details to console
   - Message is discarded

2. **Communication Errors**
   - When Comm is closed, execute cleanup processing
   - Manage multiple cleanup handlers with `EventEmitter` pattern

3. **Widget Close**
   - When user closes tab, `onCloseRequest()` is called
   - Send `FromApp.Closed` message to Python side
   - Close Comm and release resources

### Widget Environment Management

Manage all widget instances with `widgetEnvs` Map:

```typescript
export const widgetEnvs = new Map<string, StellarGlobeWidgetEnv>()
```

This enables:
- Search for widgets by window ID
- Implement collaboration features between multiple windows (lock functionality, etc.)
- Send messages to any window from Python side

## Development Procedure

### Development Environment Setup

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

When developing with `jlpm watch` running, changes are automatically rebuilt on file save and reflected when JupyterLab is refreshed.

### Debugging

To build with source maps enabled:

```bash
jupyter lab build --minimize=False
```

This makes debugging easier in browser developer tools.

### Uninstall Development Mode

```bash
pip uninstall stellar_globe_jupyterlab_extension
```

Also need to remove the `@stellar-globe/jupyterlab-extension` symbolic link in the `labextensions` folder, which can be confirmed with `jupyter labextension list`.

## Testing

### TypeScript/Frontend Testing

This project uses `jest` and `@testing-library/react` to run tests.

#### Running Tests

```bash
# Run tests once
jlpm test

# Run tests in watch mode
jlpm test:watch

# Run tests with coverage report
jlpm test:coverage
```

#### Test Files

Test files are located in the `src/__tests__/` directory:

* `eventemitter.test.ts`: EventEmitter tests
* `cropCanvasToAspectRatio.test.ts`: Canvas crop functionality tests
* `setup.ts`: Test environment setup

#### Coverage

Test coverage is generated in the `coverage/` directory.
Open `coverage/lcov-report/index.html` in a browser to view coverage visually.

### Python Testing

Python-side tests are currently not implemented. Future plans include:

* Package installation tests
* JupyterLab extension registration tests
* Basic integration tests

## Packaging

See [RELEASE.md](RELEASE.md) for release procedures.
