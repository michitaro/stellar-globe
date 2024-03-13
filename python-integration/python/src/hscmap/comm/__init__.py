from typing import Any, Optional

from hscmap.models.Open import Model as Open

from .base import CommBase


def new_comm(open_msg: Open, options: Optional[Any]) -> CommBase:
    if options is None:  # pragma: no cover
        from .jupyterlab import JupyterLabComm, JupyterLabCommOptions

        options = JupyterLabCommOptions()
    if options.__class__.__name__ == 'JupyterLabCommOptions':
        return JupyterLabComm(open_msg, options)  # type: ignore # pragma: no cover
    elif options.__class__.__name__ == 'HscmapServerCommOptions':  # pragma: no cover
        from .hscmapserver import HscmapServerComm

        return HscmapServerComm(open_msg, options)  # type: ignore
    elif options.__class__.__name__ == 'MockCommOptions':
        from .mock import MockComm

        return MockComm(open_msg, options)  # type: ignore
    else:  # pragma: no cover
        raise ValueError(f'Unknown comm type: {type}')
