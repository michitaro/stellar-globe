from __future__ import annotations
from typing import Optional, Literal, TypedDict

P1 = Literal['FLOATING_EYE', 'GNOMONIC', 'STEREOGRAPHIC']

class Model(TypedDict):
    payload: P1
    type: Literal['camera/projectionUpdated']