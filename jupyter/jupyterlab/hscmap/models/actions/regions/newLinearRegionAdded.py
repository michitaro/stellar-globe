from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List


class End(TypedDict):
    dec: float
    ra: float

class Start(TypedDict):
    dec: float
    ra: float

class Payload(TypedDict):
    color: Optional[List[float]]
    end: End
    id: str
    name: str
    showLabel: bool
    start: Start
    type: Optional[str]
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/newLinearRegionAdded']