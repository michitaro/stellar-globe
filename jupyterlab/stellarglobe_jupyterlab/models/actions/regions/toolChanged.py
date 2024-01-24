from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import Literal, NotRequired, TypedDict
ToolType = Literal['circle', 'line', 'pan', 'rect', 'text']

class Payload(TypedDict):
    tool: ToolType

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/toolChanged']