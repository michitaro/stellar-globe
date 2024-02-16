import json
from .angle import Angle
import time
from pathlib import Path
from typing import Any, List, Literal, Optional, cast

from .comm import create_comm
from .jsonpatchapply import apply_patch
from .models.Close import Model as CloseMessage
from .models.Dispatch import Model as DispatchMessage
from .models.frontend.QueryStateResponse import Model as QueryStateResponseMessage
from .models.frontend.Ready import Model as FrontendReadyMessage
from .models.frontend.StoreChanged import Model as StoreChangedMessage
from .models.JumpTo import Model as JumpToMessage
from .models.LockFrame import Model as LockFrameMessage
from .models.QuerySnapshot import Model as QuerySnapshotMessage
from .models.QueryState import Model as QueryStateMessage
from .models.ShowError import Model as ShowErrorMessage
from .models.StellarGlobeWidgetParams import Model as StellarGlobeWidgetParams
from .models.store import Model as StoreState
from .models.UnlockFrame import Model as UnlockFrameMessage
from .models.UpdateWidgetState import Model as UpdateWidgetStateMessage
from .tinyid import tinyid

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
    _id: str
    _title: str
    _connection_status: Literal['disconnected', 'connected'] = 'disconnected'
    _store_revision = -1
    _store_state: StoreState = None  # type: ignore
    _msg_log: List[Any]

    def __init__(
        self,
        *,
        title: Optional[str] = None,
        layout: Optional[Layout] = None,
        angle_unit: Angle.Unit = 'degree',
    ):
        self._id = tinyid()
        self._msg_log = []
        self._title = title or 'hscMap'
        self._open_new_window(layout=layout)
        self._angle_input, self._angle_output = Angle.converter(angle_unit)

    def __repr__(self):
        return f'<window title={self._title} id={self._id}>'

    def _open_new_window(self, *, layout: Optional[Layout]):
        response_file = f'~query-{tinyid()}'
        self._comm = create_comm(
            comm_target,
            _remove_none(
                StellarGlobeWidgetParams(
                    id=self._id,
                    title=self._title,
                    layout=cast(Any, layout),
                    initialState=self._store_state,
                    responseFile=response_file,
                )
            ),
        )
        self._comm.on_msg(self._on_msg)
        msg: FrontendReadyMessage = json.loads(_wait_for_query_response(response_file))
        self._connection_status = 'connected'
        self._store_state = cast(StoreState, msg['state'])
        self._store_revision = msg['revision']

    def _post_message(self, msg):
        if self._connection_status == 'disconnected':
            self.reopen()
        self._comm.send(_remove_none(msg))

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
        if type == 'Closed':
            self._on_closed()
        elif type == 'StoreChanged':
            store_changed_msg: StoreChangedMessage = msg
            self._store_revision += 1
            if self._store_revision == store_changed_msg['revision']:
                self._store_state = apply_patch(self._store_state, store_changed_msg['diff'])  # type: ignore
            else:
                self.sync()
        else:
            self._show_error(title='Error', body=f'Unknown message from Jupyter: type={repr(type)}')

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

    def _dispatch(self, action):
        self._post_message(DispatchMessage(type='Dispatch', action=action))

    def _on_closed(self):
        self._connection_status = 'disconnected'

    def close(self):
        if self._connection_status != 'disconnected':
            self._post_message(CloseMessage(type='Close'))

    def reopen(self, *, layout: Optional[Layout] = None):
        if self._connection_status == 'disconnected':
            self._open_new_window(layout=layout)

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, new_title: str):
        self._title = new_title
        self._post_message(UpdateWidgetStateMessage(type='UpdateWidgetState', title=new_title))

    def lock(self, *windows: 'Window'):
        ids = [self._id, *[w._id for w in windows]]
        self._post_message(LockFrameMessage(type='LockFrame', window_ids=ids))

        def unlock():
            self._post_message(UnlockFrameMessage(type='UnlockFrame', window_ids=ids))

        return unlock

    def sync(self):
        response_file = f'~query-{tinyid()}'
        self._post_message(QueryStateMessage(type='QueryState', responseFile=str(response_file)))
        msg: QueryStateResponseMessage = json.loads(_wait_for_query_response(response_file))
        self._store_state = msg['state']
        self._store_revision = msg['revision']

    def snapshot(self, *, aspect_ratio: Optional[float] = None):
        import base64

        from IPython.display import Image

        response_file = f'~query-{tinyid()}'
        self._post_message(QuerySnapshotMessage(type='QuerySnapshot', responseFile=str(response_file), aspectRatio=aspect_ratio))
        data_url = _wait_for_query_response(response_file)
        _, encoded = data_url.split(",", 1)
        image_data = base64.b64decode(encoded)
        image = Image(data=image_data)
        return image

    def jump_to(
        self,
        ra: float,
        dec: float,
        *,
        fov: Optional[float] = None,
        duration=0.2,
        non_block=False,
        easing: Optional[Literal['fastStart2', 'fastStart4', 'linear', 'slowStart2', 'slowStart4', 'slowStartStop2', 'slowStartStop4']] = None,
    ):
        self._post_message(
            JumpToMessage(
                type='JumpTo',
                ra=self._angle_input(ra).radian,
                dec=self._angle_input(dec).radian,
                fov=self._angle_input(fov).radian if fov is not None else None,
                duration=duration,
                easingFunction=easing,  # type: ignore
            )
        )
        if not non_block:
            time.sleep(duration)


def _wait_for_query_response(response_file: str, *, timeout=10, poll_interval=0.1) -> str:
    deadline = time.time() + timeout
    while time.time() <= deadline:
        parent = Path(response_file).absolute().parent
        while True:
            try:
                p = parent / response_file
                with open(p) as f:
                    size_str = f.readline()
                    assert size_str[-1] == '\n'
                    response = f.read()
                    if len(response) == int(size_str):
                        p.unlink()
                        return response
            except AssertionError:
                pass
            except FileNotFoundError:
                pass
            if parent == parent.parent:
                break
            parent = parent.parent
        time.sleep(poll_interval)
    raise TimeoutError()


def _remove_none(o) -> Any:
    if isinstance(o, dict):
        return {k: _remove_none(v) for k, v in o.items() if not v is None}
    if isinstance(o, list):
        return [_remove_none(e) for e in o]
    return o
