from dataclasses import dataclass
from typing import Optional

from .._models.LayerProps.TextLayer import Model as Props, Text
from .BaseLayer import BaseLayer


@dataclass
class TextLayer(BaseLayer):
    type = 'TextLayer'
    texts: list[Text]
    defaultColor: Optional[str] = None
    defaultFont: Optional[str] = None
    visible: bool = True

    def props(self):
        return Props(
            alphaFunc=None,
            defaultColor=self.defaultColor,
            defaultFont=self.defaultFont,
            texts=self.texts,
            visible=self.visible,
        )

    Text = Text
