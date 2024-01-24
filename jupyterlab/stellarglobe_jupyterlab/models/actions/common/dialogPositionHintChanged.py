from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import NotRequired, TypedDict

class PartialRecordTopBottomLeftRightNumber(TypedDict):
    bottom: Optional[float]
    left: Optional[float]
    right: Optional[float]
    top: Optional[float]

class Model(TypedDict):
    payload: PartialRecordTopBottomLeftRightNumber
    type: Literal['common/dialogPositionHintChanged']