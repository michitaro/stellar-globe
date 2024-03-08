from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Any, List, Union


class JsonPatchOp1(TypedDict):
    op: Optional[str]
    path: str
    value: Any

class JsonPatchOp2(TypedDict):
    op: Optional[str]
    path: str

class JsonPatchOp3(TypedDict):
    op: Optional[str]
    path: str
    value: Any
JsonPatchOp4 = TypedDict('JsonPatchOp4', {'from': str, 'op': Optional[str], 'path': str})
JsonPatchOp = Union[JsonPatchOp1, JsonPatchOp2, JsonPatchOp3, JsonPatchOp4]

class Model(TypedDict):
    diff: List[JsonPatchOp]
    revision: float
    type: Literal['StoreChanged']