from .comm import create_comm
from .utils.uid import uid
from .utils.as_msg import as_msg


class Window:
    def __init__(self, title: str | None = None) -> None:
        msg = {
            'id': f'stellarglobe({uid()})',
            'title': title,
        }
        self._comm = create_comm(
            'stellarglobe/new',
            as_msg(msg),
        )

    def _post_message(self, msg):
        self._comm.send(as_msg(msg))
