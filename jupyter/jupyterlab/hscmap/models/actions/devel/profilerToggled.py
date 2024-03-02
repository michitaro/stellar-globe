from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Payload(TypedDict):
    active: bool

class Model(TypedDict):
    payload: Payload
    type: Literal['devel/profilerToggled']