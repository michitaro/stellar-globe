from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any
# from typing_extensions import NotRequired, TypedDict

class Action(TypedDict):
    payload: Any
    type: str

class Model(TypedDict):
    action: Action
    type: Literal['Dispatch']