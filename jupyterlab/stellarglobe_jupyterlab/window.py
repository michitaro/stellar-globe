from typing import Any, List, Literal, Optional, cast

from .comm import create_comm
from .jsonpatchapply import apply_patch
from .models.Close import Model as CloseMessage
from .models.Dispatch import Model as DispatchMessage
from .models.frontend.Ready import Model as JupyterReadyMessage
from .models.frontend.StoreChanged import Model as StoreChangedMessage
from .models.ShowError import Model as ShowErrorMessage
from .models.StellarGlobeWidgetParams import Model as StellarGlobeWidgetParams
from .models.store import Model as StoreState

comm_target = 'stellarglobe/new'

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


class Window:
    _title: Optional[str]
    _connection_status: Literal['disconnected', 'connecting', 'connected'] = 'disconnected'
    _store_state: StoreState = None  # type: ignore
    _msg_log: List[Any]
    _msg_buffer: List[Any]

    def __init__(self, title: Optional[str] = None, layout: Optional[Layout] = None):
        self._msg_log = []
        self._msg_buffer = []
        self._title = title
        self._open_new_window(layout=layout)

    def _open_new_window(self, *, layout: Optional[Layout]):
        self._connection_status = 'connecting'
        self._comm = create_comm(
            comm_target,
            remove_none(
                StellarGlobeWidgetParams(
                    title=self._title,
                    layout=layout,  # type: ignore
                    initialState=self._store_state,
                )
            ),
        )
        self._comm.on_msg(self._on_msg)

    def _post_message(self, msg):
        if self._connection_status == 'disconnected':
            self.reopen()
        self._msg_buffer.append(msg)
        self._flush_msgs()

    def _flush_msgs(self):
        if self._connection_status == 'connected':
            for msg in self._msg_buffer:
                self._comm.send(remove_none(msg))
            self._msg_buffer = []

    def _show_error(self, title: str, body: str):
        self._post_message(
            ShowErrorMessage(
                type='ShowError',
                params={
                    'body': body,
                    'title': title,
                },
            )
        )

    def _on_msg(self, raw_msg):
        msg = raw_msg['content']['data']

        self._msg_log.append(raw_msg)
        self._msg_log = self._msg_log[-10:]

        type = msg.get('type')
        if type == 'Ready':
            ready_msg: JupyterReadyMessage = msg
            self._connection_status = 'connected'
            self._flush_msgs()
            self._store_state = cast(StoreState, ready_msg['state'])
        elif type == 'Closed':
            self._on_closed()
        elif type == 'StoreChanged':
            store_changed_msg: StoreChangedMessage = msg
            self._store_state = apply_patch(self._store_state, store_changed_msg['diff'])  # type: ignore
        else:
            self._show_error(title='Error', body=f'Unknown message from Jupyter: {type}')

        # elif type == 'callback':

        #     def show_error(error):
        #         self._post_message(
        #             ShowErrorMessage(
        #                 type='showErrorMessage',
        #                 args={
        #                     'title': str(error[1]),
        #                     'body': ''.join(traceback.format_exception(*error)),
        #                 },
        #             )
        #         )

        #     on_callback(msg, on_error=show_error)

    def _on_closed(self):
        # self._comm.close()
        self._connection_status = 'disconnected'

    def close(self):
        if self._connection_status != 'disconnected':
            self._post_message(CloseMessage(type='Close'))

    def reopen(self, *, layout: Optional[Layout] = None):
        if self._connection_status == 'disconnected':
            self._open_new_window(layout=layout)

    def _dispatch(self, action):
        self._post_message(DispatchMessage(type='Dispatch', action=action))

    @property
    def connected(self):
        return self._connection_status == 'connected'

    @property
    def camera_center(self):
        camera_params = self._store_state['camera']['params']
        return camera_params['theta'], camera_params['phi']


def remove_none(o) -> Any:
    if isinstance(o, dict):
        return {k: remove_none(v) for k, v in o.items() if not v is None}
    if isinstance(o, list):
        return [remove_none(e) for e in o]
    return o
