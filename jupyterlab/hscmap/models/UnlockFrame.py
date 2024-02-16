from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List
# from typing_extensions import NotRequired, TypedDict

class Model(TypedDict):
    type: Literal['UnlockFrame']
    window_ids: List[str]