from typing import Any, Optional

from .base import CommBase


def new_comm(initial_msg: Any, options: Optional[Any]) -> CommBase:
    if options is None:  # pragma: no cover
        from .jupyterlab import JupyterLabComm, JupyterLabCommOptions

        options = JupyterLabCommOptions()
    if options.__class__.__name__ == 'JupyterLabCommOptions':
        return JupyterLabComm(initial_msg, options)  # type: ignore # pragma: no cover
    elif options.__class__.__name__ == 'MockCommOptions':
        from .mock import MockComm

        return MockComm(initial_msg, options)  # type: ignore
    else:  # pragma: no cover
        raise ValueError(f'Unknown comm type: {type}')
