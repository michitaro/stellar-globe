from typing import Any

from .base import CommBase
from .jupyterlab import JupyterLabComm


def new_comm(initial_msg: Any) -> CommBase:
    return JupyterLabComm(initial_msg)
