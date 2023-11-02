from dataclasses import dataclass

from .._models.LayerProps.HipparcosCatalogLayer import Model as Props
from .BaseLayer import BaseLayer


@dataclass
class HipparcosCatalogLayer(BaseLayer):
    type = 'HipparcosCatalogLayer'
    visible: bool = True

    def props(self):
        return Props(visible=self.visible)

