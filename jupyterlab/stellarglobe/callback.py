from typing import Callable
from weakref import WeakValueDictionary

from ._models.MessageToPython.callback import Model as CallbackFromJS
from ._models.MessageToJS.CallbackProp import Model as CallbackProp


callbacks: WeakValueDictionary[str, Callable] = WeakValueDictionary()


def on_callback(msg: CallbackFromJS):
    assert msg['type'] == 'callback'
    id = msg['callback']['id']
    cb = callbacks.get(id)
    if cb is None:
        raise RuntimeError(f'Invalid callback id: {id}')
    cb(msg['callback']['arg'])


def enable_callback(cb: Callable):
    cid = f'{id(cb)}'
    callbacks[cid] = cb
    return CallbackProp(
        stellarglobe_callback={
            'id': cid,
        }
    )
