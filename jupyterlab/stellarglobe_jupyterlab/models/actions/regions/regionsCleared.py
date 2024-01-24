from __future__ import annotations
from typing import Optional, Literal
from typing import Any, Dict
from typing_extensions import NotRequired, TypedDict

class Model(TypedDict):
    payload: Dict[str, Any]
    type: Literal['regions/regionsCleared']