from __future__ import annotations
from typing import Optional, Literal
from typing import Any
from typing_extensions import Literal, NotRequired, TypedDict

class Model(TypedDict):
    initialState: Optional[Any]
    layout: Optional[Literal['merge-bottom', 'merge-left', 'merge-right', 'merge-top', 'split-bottom', 'split-left', 'split-right', 'tab-after', 'tab-before']]
    title: Optional[str]