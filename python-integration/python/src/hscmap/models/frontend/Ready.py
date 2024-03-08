from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any


class Model(TypedDict):
    revision: float
    state: Any
    type: Literal['Ready']