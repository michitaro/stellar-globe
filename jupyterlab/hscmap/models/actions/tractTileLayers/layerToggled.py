from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Payload(TypedDict):
    name: str
    visible: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['tractTileLayers/layerToggled']