from __future__ import annotations
from typing import Optional, Literal, TypedDict
# from typing_extensions import Literal, NotRequired, TypedDict
AngleUnit = Literal['degree', 'radian', 'sexadecimal']

class Payload(TypedDict):
    angleUnit: AngleUnit

class Model(TypedDict):
    payload: Payload
    type: Literal['common/unitChanged']