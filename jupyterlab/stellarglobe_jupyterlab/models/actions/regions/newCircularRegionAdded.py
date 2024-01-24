from __future__ import annotations
from typing import Optional, Literal
from typing import List
from typing_extensions import NotRequired, TypedDict

class Center(TypedDict):
    dec: float
    ra: float

class Payload(TypedDict):
    center: Center
    color: Optional[List[float]]
    id: str
    name: str
    radius: float
    showLabel: bool
    type: Optional[str]
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/newCircularRegionAdded']