from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any


class Model(TypedDict):
    id: str
    initialState: Optional[Any]
    layout: Optional[Literal['merge-bottom', 'merge-left', 'merge-right', 'merge-top', 'split-bottom', 'split-left', 'split-right', 'tab-after', 'tab-before']]
    queryId: str
    title: Optional[str]