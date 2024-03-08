from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Model(TypedDict):
    payload: bool
    type: Literal['common/activeChanged']