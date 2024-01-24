from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import Literal, NotRequired, TypedDict
CameraMode = Literal['FLOATING_EYE', 'GNOMONIC', 'STEREOGRAPHIC']

class Model(TypedDict):
    payload: CameraMode
    type: Literal['camera/projectionUpdated']