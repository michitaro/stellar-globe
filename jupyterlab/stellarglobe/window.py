from typing import NotRequired
from .comm import create_comm
from .models.LayerProps.EsoMilkyWayLayer import Model as EsoMilkyWayLayer
from .models.OpenWindowMessage import Model as OpenWindowMessage
from .utils.uid import uid


class Window:
    def __init__(self, title: str | None = None) -> None:
        msg = OpenWindowMessage(id=str(uid()), layout='split-right')
        self._comm = create_comm(
            'stellarglobe/new',
            dict(msg),
        )
        self._comm.send(
            {
                'type': 'clear',
            }
        )

    def _post_message(self, msg):
        self._comm.send(msg)
