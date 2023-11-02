from dataclasses import dataclass

from .._models.LayerProps.GridLayer import Model as Props
from .BaseLayer import BaseLayer


@dataclass
class GridLayer(BaseLayer):
    type = 'GridLayer'
    visible: bool = True

    def props(self):
        return Props(visible=self.visible, optionsManipulate=None)
