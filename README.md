<!-- 
* Component names like app, stellar-globe, react-stellar-globe, react-draggable-dialog should be wrapped in ``
-->
# Stellar Globe

Stellar Globe is an all-sky viewer project used in the Hyper Suprime-Cam (HSC) Public Data Release and other applications.
It runs in web browsers and is designed to display large-scale astronomical image data quickly and flexibly.

**This application is being developed as part of the [HSC-SSP project](https://hsc.mtk.nao.ac.jp/ssp/) at the National Astronomical Observatory of Japan.**

## Key Features

* **High-speed rendering**: Utilizes WebGL to display any position at any zoom level quickly.
* **Dynamic color composition**: Dynamically generates color images from multi-band data on the client side.
* **Multiple format support**: Supports hscMap format and HiPS format data.
* **Catalog overlay**: Can overlay astronomical catalog data on images.

## Component Structure and Dependencies

This repository is a monorepo consisting of multiple components.
The roles and dependencies of each component are as follows:

### Core Library

* **`stellar-globe`**
  * The core library of the project.
  * Provides basic functionality including WebGL-based rendering logic, shaders, and data loading.
  * Operates independently without dependencies on React components.

### UI Components

* **`react-stellar-globe`**
  * A wrapper component for easily using `stellar-globe` from React applications.
  * Provides lifecycle management and declarative API aligned with React.
  * Depends on `stellar-globe`.

* **`react-draggable-dialog`**
  * A general-purpose React component providing draggable dialog boxes.
  * Not directly related to viewer functionality, but used for application UI construction.
  * Has no dependencies on other components.

### Application

* **`app`**
  * The actual viewer application built by combining the above components.
  * The implementation of the `hscMap` application in HSC PDR.
  * Depends on `stellar-globe`, `react-stellar-globe`, and `react-draggable-dialog`.

### Python Integration

* **`python-integration`**
  * Tools for controlling the `app` from Python environments (such as JupyterLab).
  * Includes the following sub-components:
    * `python`: Python client library.
    * `jupyterlab-extension`: JupyterLab extension.
    * `hscmap-server`: Custom HTTP server.

## Dependency Graph

```mermaid
graph TD
    app --> react-stellar-globe
    app --> react-draggable-dialog
    app --> stellar-globe
    react-stellar-globe --> stellar-globe
    python-integration --> app
```

## Python Integration

The `app` application can be controlled from Python.
This enables integration with data analysis environments like JupyterLab, allowing visualization of analysis results in the viewer and control of viewer state from Python.
The `app` can run within a JupyterLab tab or using a custom HTTP server.

## Build Instructions

To build the entire project, run the following command:

```bash
bash ./build.bash
```

### Prerequisites

The build requires the following environment:

* **Node.js**: Version 18 or later recommended
* **Python**: Version 3.12 or later (required for building `python-integration`)
* **npm/yarn**: Node.js package manager

### Build Script Details

`build.bash` executes builds in the following order:

1. **`stellar-globe`**: Build the core library
2. **`react-stellar-globe`**: Build the React wrapper
3. **`react-draggable-dialog`**: Build the dialog component
4. **`app`**: Build the main application
   - Generate JSON Schema for type validation
   - Build library version
   - Build standalone version
5. **`python-integration/python`**: Build Python library (requires Python environment)
6. **`python-integration/jupyterlab-extension`**: Build JupyterLab extension
7. **`python-integration/jupyterlite`**: Build for JupyterLite

### Partial Build

To build only specific components, run `make` or `npm run build` in each directory:

```bash
# Build only stellar-globe
cd stellar-globe
npm install
npm run build

# Build only app
cd app
npm install
npm run build-lib        # Library version
npm run build-standalone # Standalone version
```

### Troubleshooting

**Python Virtual Environment Errors**

If the build for `python-integration/python` fails due to missing virtual environment, run the following first:

```bash
cd python-integration/python
make setup
```

**Dependency Package Errors**

Install dependencies for each component by running `npm install`:

```bash
cd stellar-globe && npm install
cd ../react-stellar-globe && npm install
cd ../react-draggable-dialog && npm install
cd ../app && npm install
```

## Main Repository and Mirrors

The main repository is located at:
* https://hsc-gitlab.mtk.nao.ac.jp/michitaro/stellar-globe2

Other repositories (such as GitHub) are mirrors.

## Issue Reporting

Issues (bug reports and feature requests) are accepted in Japanese or English.
Please create an issue in either the main repository or any mirror.
