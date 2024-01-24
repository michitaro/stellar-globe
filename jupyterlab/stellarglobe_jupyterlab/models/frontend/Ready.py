from __future__ import annotations
from typing import Optional, Literal
from typing import Any
from typing_extensions import NotRequired, TypedDict

class Model(TypedDict):
    state: Any
    type: Literal['Ready']