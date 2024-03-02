from __future__ import annotations
from typing import Optional, Literal, TypedDict


class Payload(TypedDict):
    id: str

class Model(TypedDict):
    payload: Payload
    type: Literal['catalogs/catalogDeleted']