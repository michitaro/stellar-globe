from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Model(TypedDict):
    title: str
    type: Literal['UpdateWidgetState']