from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Params(TypedDict):
    body: str
    title: str

class Model(TypedDict):
    params: Params
    type: Literal['ShowError']