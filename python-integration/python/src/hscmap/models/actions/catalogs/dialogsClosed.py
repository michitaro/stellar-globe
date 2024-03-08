from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any, Dict


class Model(TypedDict):
    payload: Dict[str, Any]
    type: Literal['catalogs/dialogsClosed']