# Python Integration

Tools for using and controlling Stellar Globe (HSC Map) from Python environments.

## Components

### `python` (hscmap)
Client library for operating the viewer from Python.
Used as a widget in JupyterLab or for controlling remote viewers.

### `jupyterlab-extension`
Extension for JupyterLab.
Displays HSC Map in JupyterLab tabs and provides functionality to communicate with Python kernels.

### `hscmap-server`
Server application for distributing and controlling HSC Map as a standalone web server without using JupyterLab.

## Usage

### Using in JupyterLab

```bash
pip install hscmap
jupyter labextension install @stellar-globe/jupyterlab-extension
```

Python code example:

```python
import hscmap

# Open window
w = hscmap.Window()

# Jump to specified coordinates
w.jump_to(ra=180, dec=0, fov=1)
```
