from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List


class Position(TypedDict):
    dec: float
    ra: float

class Payload(TypedDict):
    color: Optional[List[float]]
    id: str
    name: str
    position: Position
    showLabel: bool
    type: Optional[str]
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/newTextRegionAdded']