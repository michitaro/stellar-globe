from typing import Any, Union, Optional

from .base import CommBase
from .jupyterlab import JupyterLabComm, JupyterLabCommOptions
from .reference import ReferenceComm, ReferenceCommOptions


Options = Union[
    JupyterLabCommOptions,
    ReferenceCommOptions,
]


def new_comm(initial_msg: Any, options: Optional[Options]) -> CommBase:
    if options is None:  # pragma: no cover
        options = JupyterLabCommOptions()
    if isinstance(options, JupyterLabCommOptions):  # pragma: no cover
        return JupyterLabComm(initial_msg, options)
    elif isinstance(options, ReferenceCommOptions):
        return ReferenceComm(initial_msg, options)
    else:  # pragma: no cover
        raise ValueError(f'Unknown comm type: {type}')
