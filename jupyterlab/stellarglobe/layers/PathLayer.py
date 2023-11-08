from dataclasses import dataclass
from typing import Literal, Optional, List

from .._models.LayerProps.PathLayer import Model as Props
from .._models.LayerProps.PathLayer import Path
from .BaseLayer import BaseLayer


@dataclass
class PathLayer(BaseLayer):
    type = 'PathLayer'
    paths: List[Path]
    blend_mode: Optional[Literal['ADD', 'NORMAL']] = None
    dim_on_zoom: Optional[bool] = None
    visible: Optional[bool] = None

    def props(self):
        return Props(
            blendMode=self.blend_mode,
            dimOnZoom=self.dim_on_zoom,
            paths=self.paths,
            visible=self.visible,
        )
