import sys
from typing import Callable, Optional, TYPE_CHECKING, Dict
import weakref

from ._models.MessageToJS.CallbackProp import Model as CallbackProp
from ._models.MessageToPython.callback import Model as CallbackFromJS


if TYPE_CHECKING:
    callbacks: Dict[str, Callable] = {}
else:
    # with Python 3.8, we cannot use type annotated WeakValueDictionary.
    callbacks = weakref.WeakValueDictionary()


def on_callback(msg: CallbackFromJS, *, on_error: Optional[Callable]):
    assert msg['type'] == 'callback'
    id = msg['callback']['id']
    cb = callbacks.get(id)
    if cb is None:
        raise RuntimeError(f'Invalid callback id: {id}')
    try:
        cb(msg['callback']['arg'])
    except Exception:
        if on_error:
            on_error(sys.exc_info())


cb_memo: Dict[str, Callable] = {}


def enable_callback(cb: Callable, *, debounce: Optional[float] = None, event_converter: Optional[Callable] = None):
    cid = f'{id(cb)}'

    if event_converter:
        # Keep the converted cb in cb_memo to prevent it from being garbage collected while the original cb is alive.

        def cleanup(_):
            cb_memo.pop(cid)

        weakref.ref(cb, cleanup)
        cb = apply_event_converter(cb, event_converter)
        cb_memo[cid] = cb

    callbacks[cid] = cb

    return CallbackProp(
        stellarglobe_callback={
            'id': cid,
            'debounce': debounce,
        }
    )


def apply_event_converter(cb, converter):
    def f(event):
        return cb(converter(event))

    return f
