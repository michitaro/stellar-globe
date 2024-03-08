from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import List


class Model(TypedDict):
    args: List
    level: Literal['debug', 'info', 'log', 'warn']
    type: Literal['FrontendConsole']