from .comm import create_comm
from typing import Optional


comm_target = 'stellarglobe/new'


class Window:
    def __init__(self, title: Optional[str]):
        self._comm = create_comm(comm_target, {})

    def _send_msg(self):
        pass
