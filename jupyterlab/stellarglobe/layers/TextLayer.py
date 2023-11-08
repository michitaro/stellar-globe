from dataclasses import dataclass
from typing import Optional, List

from .._models.LayerProps.TextLayer import Model as Props, Text
from .BaseLayer import BaseLayer


@dataclass
class TextLayer(BaseLayer):
    type = 'TextLayer'
    texts: List[Text]
    default_color: Optional[str] = None
    default_font: Optional[str] = None
    visible: bool = True

    def props(self):
        return Props(
            alphaFunc=None,
            defaultColor=self.default_color,
            defaultFont=self.default_font,
            texts=self.texts,
            visible=self.visible,
        )

    Text = Text
