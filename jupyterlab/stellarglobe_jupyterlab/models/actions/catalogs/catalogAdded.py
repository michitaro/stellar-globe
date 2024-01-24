from __future__ import annotations
from typing import Optional, Literal
from typing import List
from typing_extensions import Literal, NotRequired, TypedDict

class Marker(TypedDict):
    color: Optional[List[float]]
    position: List[float]
    type: Optional[Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']]

class Params(TypedDict):
    attributes: List[List[str]]
    defaultColor: Optional[List[float]]
    defaultType: Optional[Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']]
    fields: List[str]
    hasColorCol: bool
    hasMarkerTypeCol: bool
    id: Optional[str]
    markers: List[Marker]
    name: str

class Payload(TypedDict):
    id: str
    params: Params

class Model(TypedDict):
    payload: Payload
    type: Literal['catalogs/catalogAdded']