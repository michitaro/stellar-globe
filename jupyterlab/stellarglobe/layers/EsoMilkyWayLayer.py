from dataclasses import dataclass
from typing import Optional

from .._models.LayerProps.EsoMilkyWayLayer import Model as Props
from .BaseLayer import BaseLayer


@dataclass
class EsoMilkyWayLayer(BaseLayer):
    type = 'EsoMilkyWayLayer'

    fadeInDuration: Optional[float] = None
    visible: bool = True

    def props(self):
        return Props(
            fadeInDuration=self.fadeInDuration,
            visible=self.visible,
        )
