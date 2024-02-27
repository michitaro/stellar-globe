from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any


class Action(TypedDict):
    payload: Any
    type: str

class Model(TypedDict):
    action: Action
    type: Literal['Dispatch']