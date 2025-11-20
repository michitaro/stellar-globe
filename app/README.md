# @stellar-globe/app

Main application of the Stellar Globe project.
Contains the implementation of a web application that operates as hscMap.

## Purpose

* Provide an all-sky viewer application
* Integration with Jupyter environments (JupyterLab, JupyterLite)
* Provide user interface

## Usage

### Starting Development Server

```bash
npm install
npm run dev
```

### Building

```bash
npm run build-lib       # Build as library
npm run build-standalone # Build as standalone app
```

## Design Principles

* **Use of Redux**: Redux (Redux Toolkit) is used for application state management. This facilitates state manipulation from external sources (such as Python).
* **Jupyter Integration**: By leveraging Jupyter functionality, advanced analysis features such as graph display are delegated, keeping the main body lightweight.

## Application Structure

### Directory Structure

* **`src/app/`**: Main application code
  * `store/`: Redux store definition and slices
  * `features/`: Components and logic for each feature
  * `MainViewer.tsx`: Main viewer component
  * `AppDialog/`: Dialog components group
  * `MainMenu/`: Menu bar
  * `keybindings/`: Keyboard shortcuts

* **`src/commTools/`**: Communication tools with external sources (Python)
  * `toAppTypeValidation/`: Type validation for messages to app
  * `actionTypeValidation/`: Type validation for Redux actions
  * `storesync/`: Redux store synchronization
  * `jsonpatch/`: Differential updates via JSON Patch

* **`src/common/`**: Common utilities

* **`src/standalone/`**: Entry point for standalone application

### Redux Store

State management is performed using Redux Toolkit.
Main slices include:

* `baseImageSlice`: Base image settings
* `catalogSlice`: Catalog data
* `globeSlice`: Globe viewer state
* Other slices corresponding to each feature

## Key Features

* Display and manipulation of all-sky images
* Catalog data overlay
* External integration API (CommTools)

## Type Checking Mechanism for Python Integration

A mechanism to check type consistency at runtime is implemented for communication between `app` and Python.

### Mechanism

1. **TypeScript Type Definitions**: Define types for messages and actions in `types/commTools/index.d.ts`
2. **JSON Schema Generation**: Automatically generate JSON Schema from TypeScript types using `typescript-json-schema`
   ```bash
   npm run make-toapp-typevalidator    # For ToApp messages
   npm run make-action-typevalidator   # For Redux actions
   ```
3. **Runtime Validation**: Perform runtime type validation based on JSON Schema using the `ajv` library
   * Python→app: Validate with `validateToAppMessage()` function
   * Python→Redux: Validate with `validateAction()` function

### Python Type Definitions

On the Python side, type checking is performed using the same JSON Schema.
See the `python-integration/python` documentation for details.

### Type Update Procedure

1. Update type definitions in `types/commTools/index.d.ts`
2. Run `npm run refresh-types` to regenerate JSON Schema
3. Update corresponding type definitions on Python side as well

## Details of Python Communication

### Overview

The `app` is designed to be controlled from Python in Jupyter environments (JupyterLab, JupyterLite).
Communication primarily occurs through the Jupyter Comm mechanism, exchanging messages between the `app` running in an iframe and JupyterLab widgets.

### Message Reception

The `app` provides the following two APIs for receiving messages from external sources:

1. **`AppHandle.dispatchAction()`**
   - API for dispatching Redux actions
   - Defined in `AppHandle` type in `app/src/app/index.tsx`
   - JupyterLab extension calls this method when it receives a `ToApp.Dispatch` message

2. **Direct method calls**
   - Various methods defined in the `AppHandle` type (`globe()`, `getState()`, `activate()`, `deactivate()`, etc.)
   - Used when direct access to `AppHandle` instance is available, not through iframe

### Message Flow

#### Python → app

1. **Sending messages from Python**
   ```python
   # From hscmap library
   window.jump_to(ra=180, dec=0, fov=1)
   ```

2. **Transfer via Jupyter Comm**
   - Python library (`python-integration/python`) sends `ToApp` type messages via Jupyter Comm
   - Messages conform to types defined in `types/commTools/index.d.ts`

3. **Reception in JupyterLab extension**
   - `onMsgFromPython()` function in `python-integration/jupyterlab-extension/src/StellarGlobeWidget.tsx` receives messages
   - Type checking with `validateToAppMessage()`
   - Execute processing according to message type:
     * `Dispatch`: Dispatch Redux action
     * `JumpTo`: Jump to coordinates
     * `ShowError`: Display error dialog
     * etc.

4. **Processing in app**
   - For Redux actions, processed through normal Redux flow
   - Store is updated and UI is re-rendered

#### app → Python

1. **Events from app**
   - Redux store changes are detected by `onStoreChange` callback
   - Implemented in `python-integration/jupyterlab-extension/src/StellarGlobeWidget.tsx`

2. **State difference calculation**
   - `StateManager` class (`app/src/commTools/storesync/StateManager.ts`) manages state history
   - Calculate difference in JSON Patch format with `generateJsonPatch()`

3. **Sending via Jupyter Comm**
   - Send difference as `FromApp.StoreChanged` message
   - Python library receives and synchronizes state

4. **Processing in Python**
   - Apply received difference to Python-side state model
   - Execute callbacks as needed

### Message Type Definitions

#### ToApp (Python → app)

Defined in `types/commTools/index.d.ts`:

* `Open`: Open a new window
* `Close`: Close a window
* `Dispatch`: Dispatch Redux action
* `ShowError`: Display error message
* `JumpTo`: Jump to specified coordinates
* `QueryState`: Query current state
* etc.

#### FromApp (app → Python)

* `Ready`: Notify app initialization completion
* `Closed`: Window was closed
* `StoreChanged`: Redux store was changed (includes difference information)
* `QueryStateResponse`: Response to state query

### Ensuring Type Safety

#### Runtime Validation

1. **Validation on reception**
   - `validateToAppMessage()`: Validates Python→app messages
   - `validateAction()`: Validates Redux actions
   - JSON Schema-based validation using `ajv` library

2. **Validation on sending**
   - TypeScript type system checks types of outgoing messages
   - Detects errors at compile time

#### Type Checking During Development

1. **TypeScript type definitions**
   - Define types for all messages in `types/commTools/index.d.ts`
   - Implementation code references types, and compiler checks them

2. **Python type definitions**
   - Auto-generated from `app/jsonschema/public.json`
   - Generate type-hinted classes using `dataclasses-json`

### Store Synchronization Mechanism

The `StateManager` class provides the following functionality:

1. **History management**
   - Maintains recent N states (default 5)
   - Managed by revision number

2. **Difference calculation**
   - Generate difference in JSON Patch (RFC 6902) format with `generateJsonPatch()`
   - Efficient transfer even for large states

3. **Partial synchronization**
   - Get difference from specified revision with `patchFrom(baseRevision)`
   - Handles network delays and losses

## Updating Type Information

When updating type definition files, run the following command:

```bash
npm run refresh-types
```

This command executes the following:
* Generate JSON Schema for ToApp message type validation
* Generate JSON Schema for Redux action type validation
* Generate JSON Schema for persisted state type validation
* Generate public JSON Schema
