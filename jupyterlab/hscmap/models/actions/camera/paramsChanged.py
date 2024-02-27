from __future__ import annotations
from typing import Optional, Literal, TypedDict


class CameraParams(TypedDict):
    fovy: float
    phi: float
    roll: float
    theta: float
    za: float
    zd: float
    zp: float

class Model(TypedDict):
    payload: CameraParams
    type: Literal['camera/paramsChanged']