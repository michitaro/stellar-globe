from __future__ import annotations
from typing import Optional, Literal
from typing import Any, List, Union
from typing_extensions import NotRequired, TypedDict

class JsonPatchOp1(TypedDict):
    op: str
    path: str
    value: Any

class JsonPatchOp2(TypedDict):
    op: str
    path: str

class JsonPatchOp3(TypedDict):
    op: str
    path: str
    value: Any
JsonPatchOp4 = TypedDict('JsonPatchOp4', {'from': str, 'op': str, 'path': str})
JsonPatchOp = Union[JsonPatchOp1, JsonPatchOp2, JsonPatchOp3, JsonPatchOp4]

class Model(TypedDict):
    diff: List[JsonPatchOp]
    revision: float
    type: Literal['StoreChanged']