# `jupyterlab-bridge`

Internal helper package for notebook / kernel / comm lifecycle handling in JupyterLab.

## Responsibilities

- Track kernel lifecycle per notebook panel
- Centralize comm target registration
- Prevent duplicate handling of the same comm open
- Notify consumers when the session closes

`stellar_globe_jupyterlab_extension` uses this package to localize JupyterLab 4.0-4.6 compatibility concerns.
