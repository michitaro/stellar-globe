from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Dict, List


class Dialog(TypedDict):
    checked: Dict[str, bool]
    opened: bool

class Marker(TypedDict):
    color: Optional[List[float]]
    position: List[float]
    type: Optional[Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']]

class Payload(TypedDict):
    attributes: Optional[List[List[str]]]
    baseColor: Optional[List[float]]
    defaultColor: Optional[List[float]]
    defaultType: Optional[Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']]
    dialog: Optional[Dialog]
    fields: Optional[List[str]]
    hasColorCol: Optional[bool]
    hasMarkerTypeCol: Optional[bool]
    id: str
    markers: Optional[List[Marker]]
    name: Optional[str]
    selectedRecords: Optional[Dict[str, bool]]
    visible: Optional[bool]

class Model(TypedDict):
    payload: Payload
    type: Literal['catalogs/catalogUpdated']