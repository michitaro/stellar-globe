from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List


class Payload(TypedDict):
    position: Optional[List[float]]

class Model(TypedDict):
    payload: Payload
    type: Literal['catalogs/focusedPositionChanged']