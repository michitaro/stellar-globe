from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List, Union


class Point(TypedDict):
    color: List[float]
    position: List[float]
    size: float

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
JOINT = Literal['MITER', 'NONE']

class Path(TypedDict):
    close: bool
    joint: JOINT
    points: List[Point]

class PathRegion(TypedDict):
    color: List[float]
    id: str
    name: str
    paths: List[Path]
    showLabel: bool
    type: Optional[str]
    visible: bool
Region = Union[LinearRegion, CircularRegion, RectangularRegion, TextRegion, PathRegion]

class Payload(TypedDict):
    id: str
    regionDef: Region

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/regionUpdated']