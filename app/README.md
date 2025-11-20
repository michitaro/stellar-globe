# @stellar-globe/app

Main application of the Stellar Globe project.
Contains the implementation of a web application that operates as HSC Map.

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
