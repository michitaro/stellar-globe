from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List
# from typing_extensions import NotRequired, TypedDict

class Payload(TypedDict):
    color: Optional[List[float]]
    id: str
    maxDec: float
    maxRa: float
    minDec: float
    minRa: float
    name: str
    showLabel: bool
    type: Optional[str]
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/newRectangularRegionAdded']