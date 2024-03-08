from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List


class Point(TypedDict):
    color: List[float]
    position: List[float]
    size: float
JOINT = Literal['MITER', 'NONE']

class Path(TypedDict):
    close: bool
    joint: JOINT
    points: List[Point]

class Payload(TypedDict):
    color: Optional[List[float]]
    id: str
    name: str
    paths: List[Path]
    showLabel: bool
    type: Optional[str]
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/newPathRegionAdded']