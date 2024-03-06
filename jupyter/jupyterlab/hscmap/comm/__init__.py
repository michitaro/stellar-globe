from typing import Any, Literal

from .base import CommBase
from .jupyterlab import JupyterLabComm


CommType = Literal['JupyterLab', 'Dummy']


def new_comm(initial_msg: Any, *, type: CommType) -> CommBase:
    if type == 'JupyterLab':
        return JupyterLabComm(initial_msg)
    else:
        raise ValueError(f'Unknown comm type: {type}')
