import os
from typing import Any

comm_target = 'stellarglobe/new'


class CommWrapper:
    def __init__(self, initial_msg) -> None:
        self._comm = create_comm(comm_target, _remove_none(initial_msg))

    def send(self, msg):
        self._comm.send(_remove_none(msg))

    def on_msg(self, callback):
        self._comm.on_msg(callback)


def _remove_none(o) -> Any:
    if isinstance(o, dict):
        return {k: _remove_none(v) for k, v in o.items() if not v is None}
    if isinstance(o, list):
        return [_remove_none(e) for e in o]
    return o


def create_comm(target: str, initial_msg):
    if os.environ.get('HSCMAP_ENV') == 'test':
        from .dummy_comm import DummyComm

        return DummyComm(target, initial_msg)
    else:
        try:
            from comm import create_comm

        except ImportError:
            from ipykernel.comm import Comm

            return Comm(target, initial_msg)
        else:
            return create_comm(target, initial_msg)
