from dataclasses import dataclass
from typing import Optional

from .._models.LayerProps.EsoMilkyWayLayer import Model as Props
from ..utils.unit import s2ms
from .BaseLayer import BaseLayer


@dataclass
class EsoMilkyWayLayer(BaseLayer):
    type = 'EsoMilkyWayLayer'

    fade_in_duration: Optional[float] = None
    visible: bool = True

    def props(self):
        return Props(
            fadeInDuration=self.fade_in_duration and self.fade_in_duration * s2ms,
            visible=self.visible,
        )
