from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Payload(TypedDict):
    baseUrl: Optional[str]

class Model(TypedDict):
    payload: Payload
    type: Literal['hipsLayers/baseUrlChanged']