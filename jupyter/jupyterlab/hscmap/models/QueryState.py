from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Model(TypedDict):
    responseFile: str
    type: Literal['QueryState']