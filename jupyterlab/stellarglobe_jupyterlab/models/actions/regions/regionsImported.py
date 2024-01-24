from __future__ import annotations
from typing import Optional, Literal
from typing import List, Union
from typing_extensions import NotRequired, TypedDict

class End(TypedDict):
    dec: float
    ra: float

class Start(TypedDict):
    dec: float
    ra: float

class LinearRegion(TypedDict):
    color: List[float]
    end: End
    id: str
    name: str
    showLabel: bool
    start: Start
    type: Optional[str]
    visible: bool

class Center(TypedDict):
    dec: float
    ra: float

class CircularRegion(TypedDict):
    center: Center
    color: List[float]
    id: str
    name: str
    radius: float
    showLabel: bool
    type: Optional[str]
    visible: bool

class Position(TypedDict):
    dec: float
    ra: float

class TextRegion(TypedDict):
    color: List[float]
    id: str
    name: str
    position: Position
    showLabel: bool
    type: Optional[str]
    visible: bool

class RectangularRegion(TypedDict):
    color: List[float]
    id: str
    maxDec: float
    maxRa: float
    minDec: float
    minRa: float
    name: str
    showLabel: bool
    type: Optional[str]
    visible: bool
Region = Union[LinearRegion, CircularRegion, RectangularRegion, TextRegion]

class Payload(TypedDict):
    regions: List[Region]

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/regionsImported']