from dataclasses import dataclass
from typing import Any, TypedDict, Dict

from ..utils.uid import uid


@dataclass
class BaseLayer:
    type = 'BaseLayer (Thie value should be overridden by subclasses)'

    def layer_def(self, *, key: str):
        return LayerDef(
            type=self.type,
            key=f'layer_{key}',
            props=self.props(),
        )

    def props(self) -> dict:
        raise NotImplemented()


class LayerDef(TypedDict):
    type: str
    key: str
    props: Dict[str, Any]
