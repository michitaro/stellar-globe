from __future__ import annotations
from typing import Optional, Literal
from typing import List, Union
from typing_extensions import NotRequired, TypedDict

class SimpleRgb(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams1(TypedDict):
    filters: List[str]
    simpleRgb: SimpleRgb
    type: str

class SimpleColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams2(TypedDict):
    filters: List[str]
    simpleColorMatrix: SimpleColorMatrix
    type: str

class SdssTrueColor(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams3(TypedDict):
    filters: List[str]
    sdssTrueColor: SdssTrueColor
    type: str

class SdssTrueColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams4(TypedDict):
    filters: List[str]
    sdssTrueColorMatrix: SdssTrueColorMatrix
    type: str
SspTileParams = Union[SspTileParams1, SspTileParams2, SspTileParams3, SspTileParams4]

class Payload(TypedDict):
    params: SspTileParams

class Model(TypedDict):
    payload: Payload
    type: Literal['tractTileLayers/colorParamsUpdated']