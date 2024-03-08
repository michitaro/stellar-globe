from __future__ import annotations
from typing import Optional, Literal, TypedDict

ToolType = Literal['circle', 'line', 'pan', 'path', 'rect', 'text']

class Payload(TypedDict):
    tool: ToolType

class Model(TypedDict):
    payload: Payload
    type: Literal['regions/toolChanged']