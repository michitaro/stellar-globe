from __future__ import annotations
from typing import Optional, Literal
from typing import List
from typing_extensions import Literal, NotRequired, TypedDict

class Model(TypedDict):
    args: List
    level: Literal['debug', 'info', 'log', 'warn']
    type: Literal['FrontendConsole']