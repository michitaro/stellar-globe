from typing import Literal, Optional, TypedDict

from .comm import create_comm
from ._models.MessageToJS.closeWindow import Model as CloseWindow
from ._models.MessageToJS.jumpTo import Model as JumpTo
from ._models.MessageToJS.openWindow import Model as OpenWindow
from ._models.MessageToJS.setWindowState import Model as SetWindowState
from ._models.MessageToJS.setState import Model as SetState
from .callback import on_callback
from .utils.as_msg import as_msg
from .utils.uid import uid
from .layers.BaseLayer import BaseLayer


class Window:
    _title: Optional[str]
    _closed = True
    _id = int

    Layout = Literal[
        'merge-bottom',
        'merge-left',
        'merge-right',
        'merge-top',
        'split-bottom',
        'split-left',
        'split-right',
        'split-top',
        'tab-after',
        'tab-before',
    ]

    def __init__(self, *, title: Optional[str] = None, layout: Optional[Layout] = None) -> None:
        self._id = uid()
        self._open_new_window(title=title, layout=layout)

    def _open_new_window(self, *, title: Optional[str] = None, layout: Optional[Layout] = None) -> None:
        self._title = title
        self._comm = create_comm(
            'stellarglobe/new',
            as_msg(
                OpenWindow(
                    type='openWindow',
                    args={'id': f'{self._id}', 'layout': layout, 'title': title},
                )
            ),
        )
        self._comm.on_msg(self._on_msg)
        self._comm.on_close(self._on_closed)
        self._closed = False

    def _post_message(self, msg):
        if self._closed:
            self.reopen()
        self._comm.send(as_msg(msg))

    def _on_msg(self, raw_msg):
        msg = raw_msg['content']['data']
        type = msg.get('type')
        if type == 'windowClosed':
            self._on_closed()
        elif type == 'callback':
            on_callback(msg)

    def _on_closed(self):
        self._comm.close()
        self._closed = True

    def close(self):
        if not self._closed:
            self._post_message(CloseWindow(type='closeWindow', args={}))

    def reopen(self, *, layout: Optional[Layout] = None):
        if self._closed:
            self._open_new_window(title=self._title, layout=layout)

    def jump_to(
        self,
        ra: float,
        dec: float,
        *,
        fov: Optional[float] = None,
        roll: Optional[float] = None,
        duration: Optional[float] = None,
    ):
        self._post_message(
            JumpTo(
                type='jumpTo',
                args={
                    'ra': ra,
                    'dec': dec,
                    'fov': fov,
                    'duration': duration,
                    'roll': roll,
                },
            )
        )

    def set_state(
        self,
        *,
        layers: list[BaseLayer],
    ):
        self._post_message(
            SetState(
                type='setState',
                args={
                    'layerDefs': [l.layer_def(key=f'auto-{key}') for key, l in enumerate(layers)],
                },
            )
        )

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, new_title):
        self._post_message(SetWindowState(type='setWindowState', args={'title': new_title}))
