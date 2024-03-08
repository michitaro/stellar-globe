from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Model(TypedDict):
    queryId: str
    type: Literal['QueryState']