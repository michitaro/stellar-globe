from __future__ import annotations
from typing import Optional, Literal, TypedDict
# from typing_extensions import Literal, NotRequired, TypedDict

class Model(TypedDict):
    dec: float
    duration: float
    easingFunction: Optional[Literal['fastStart2', 'fastStart4', 'linear', 'slowStart2', 'slowStart4', 'slowStartStop2', 'slowStartStop4']]
    fov: Optional[float]
    ra: float
    type: Literal['JumpTo']