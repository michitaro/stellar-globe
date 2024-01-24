from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import NotRequired, TypedDict

class Payload(TypedDict):
    open: Optional[bool]

class Model(TypedDict):
    payload: Payload
    type: Literal['hipsLayers/hipsDialogToggled']