from typing import Any, Optional

from .base import CommBase


def new_comm(initial_msg: Any, options: Optional[Any]) -> CommBase:
    if options is None:  # pragma: no cover
        from .jupyterlab import JupyterLabComm, JupyterLabCommOptions

        options = JupyterLabCommOptions()
    if options.__class__.__name__ == 'JupyterLabCommOptions':
        return JupyterLabComm(initial_msg, options)  # type: ignore
    elif options.__class__.__name__ == 'ReferenceCommOptions':
        from .reference import ReferenceComm

        return ReferenceComm(initial_msg, options)  # type: ignore
    else:  # pragma: no cover
        raise ValueError(f'Unknown comm type: {type}')
