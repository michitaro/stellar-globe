from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import NotRequired, TypedDict

class Model(TypedDict):
    responseFile: str
    type: Literal['QueryState']