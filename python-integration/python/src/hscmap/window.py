import base64
import traceback
from dataclasses import dataclass
from functools import cached_property
from typing import Any, Callable, List, Literal, Optional, cast

from .angle import Angle
from .comm import new_comm
from .jsonpatchapply import apply_patch
from .models.Close import Model as CloseMessage
from .models.Dispatch import Model as DispatchMessage
from .models.frontend.QueryStateResponse import \
    Model as QueryStateResponseMessage
from .models.frontend.Ready import Model as FrontendReadyMessage
from .models.frontend.StoreChanged import Model as StoreChangedMessage
from .models.FrontendConsole import Model as FrontendConsoleMessage
from .models.LockFrame import Model as LockFrameMessage
from .models.Open import Model as Open
from .models.QuerySnapshot import Model as QuerySnapshotMessage
from .models.QueryState import Model as QueryStateMessage
from .models.ShowError import Model as ShowErrorMessage
from .models.store import Model as StoreState
from .models.UnlockFrame import Model as UnlockFrameMessage
from .models.UpdateWidgetState import Model as UpdateWidgetStateMessage
from .tinyid import tinyid

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
    _synced: bool = True

    def __init__(
        self,
        *,
        title: Optional[str] = None,
        layout: Optional[Layout] = None,
        angle_unit: Angle.Unit = 'degree',
        comm_options: Optional[Any] = None,
    ):
        self._id = tinyid()
        self._msg_log = []
        self._title = title or 'hscMap'
        self._comm_options = comm_options
        self._open_new_window(layout=layout)
        self._angle_input, self._angle_output = Angle.converter(angle_unit)

    def __repr__(self):
        return f'<Window title={self._title} id={self._id}>'

    def _open_new_window(self, *, layout: Optional[Layout]):
        query_id = tinyid()
        self._comm = new_comm(
            Open(
                id=self._id,
                title=self._title,
                layout=cast(Any, layout),
                initialState=self._store_state,
                queryId=query_id,
                extraOptions=None,  # This field might by overwritten by the comm implementation
            ),
            self._comm_options,
        )
        self._comm.on_msg(self._on_msg)
        msg: FrontendReadyMessage = self._comm.wait_for_response(query_id)
        self._connection_status = 'connected'
        self._store_state = cast(StoreState, msg['state'])
        self._store_revision = msg['revision']

    def _post_message(self, msg):
        if self._connection_status == 'disconnected':
            self.reopen()
        self._comm.send(msg)

    def _show_error(self, title: str, body: str):  # pragma: no cover
        self._post_message(
            ShowErrorMessage(
                type='ShowError',
                params={
                    'body': body,
                    'title': title,
                },
            )
        )

    def _on_msg(self, msg):
        self._msg_log.append(msg)
        self._msg_log = self._msg_log[-10:]

        type = msg.get('type')
        if type == 'Closed':
            self._on_closed()
        elif type == 'StoreChanged':
            try:
                self._on_store_changed(cast(StoreChangedMessage, msg))
            except Exception as e:  # pragma: no cover
                self.logger.warn(f'e:\n{traceback.format_exc()}')
        else:  # pragma: no cover
            self._show_error(title='Error', body=f'Unknown message from Jupyter: type={repr(type)}')

    def _dispatch(self, action):
        self._synced = False
        self._post_message(DispatchMessage(type='Dispatch', action=action))

    def _on_closed(self):
        self._connection_status = 'disconnected'
        self._comm.close()

    def _on_store_changed(self, msg: StoreChangedMessage):
        if self._store_revision == msg['baseRevision']:
            self._store_state = apply_patch(self._store_state, msg['patch'])  # type: ignore
            self._store_revision += 1
        else:  # pragma: no cover
            self.sync()
        self._synced = True
        self.watchers._run_callbacks()

    def close(self):
        if self._connection_status != 'disconnected':  # pragma: no branch
            self._post_message(CloseMessage(type='Close'))

    def reopen(self, *, layout: Optional[Layout] = None):
        if self._connection_status == 'disconnected':  # pragma: no branch
            self._open_new_window(layout=layout)

    def js_console(self, level: Literal['debug', 'info', 'log', 'warn'], *args):  # pragma: no cover
        self._post_message(FrontendConsoleMessage(type='FrontendConsole', level=level, args=list(args)))

    def watch(self, *, watch_on: Callable, on_change: Callable):
        return self.watchers.new(watch_on=watch_on, on_change=on_change)

    @cached_property
    def watchers(self):
        from .watcher import WatcherManager

        return WatcherManager(self)

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

    def sync(
        self,
        *,
        force=False,
        full=False,
    ):
        if not force and self._synced:
            return
        query_id = tinyid()
        base_revision = -1 if full else self._store_revision
        self._post_message(QueryStateMessage(type='QueryState', queryId=query_id, baseRevision=base_revision))
        msg: QueryStateResponseMessage = self._comm.wait_for_response(query_id)
        if 'patch' in msg:
            self._store_state = apply_patch(self._store_state, msg['patch']['patch'])  # type: ignore
        if 'state' in msg:
            self._store_state = msg['state']  # type: ignore
        self._store_revision = msg['newRevision']
        self._synced = True

    def _snapshot_bytes(self, *, aspect_ratio: Optional[float] = None):
        query_id = tinyid()
        self._post_message(QuerySnapshotMessage(type='QuerySnapshot', queryId=query_id, aspectRatio=aspect_ratio))
        data_url = self._comm.wait_for_query_response_text(query_id)
        _, encoded = data_url.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        return image_bytes

    def snapshot_image(self, *, aspect_ratio: Optional[float] = None):  # pragma: no cover
        from IPython.display import Image  # type: ignore

        image_bytes = self._snapshot_bytes(aspect_ratio=aspect_ratio)
        image = Image(data=image_bytes)
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
        return self.camera.jump_to(ra, dec, fov=fov, duration=duration, non_block=non_block, easing=easing)

    @cached_property
    def camera(self):
        from .camera import Camera

        return Camera(self)

    @cached_property
    def regions(self):
        from .regions import RegionManager

        return RegionManager(self)

    @cached_property
    def catalogs(self):
        from .catalogs import CatalogManager

        return CatalogManager(self)

    @cached_property
    def dataset(self):
        from .dataset import DatasetManager

        return DatasetManager(self)

    @cached_property
    def logger(self):
        from .logger import Logger

        return Logger(self)
