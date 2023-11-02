from dataclasses import dataclass
from typing import Literal, Optional

from .._models.LayerProps.ConstellationLayer import Model as Props
from .BaseLayer import BaseLayer


@dataclass
class ConstellationLayer(BaseLayer):
    type = 'ConstellationLayer'

    fadeInDuration: Optional[float] = None
    lang: Optional[Literal['Hiragana', 'Kanji', 'English']] = 'English'
    nameColor: Optional[str] = None
    nameFont: Optional[str] = None
    showLines: bool = True
    showNames: bool = False
    visible: bool = True

    def props(self):
        return Props(
            visible=self.visible,
            fadeInDuration=self.fadeInDuration,
            lang=self.lang,
            nameColor=self.nameColor,
            nameFont=self.nameFont,
            showLines=self.showLines,
            showNames=self.showNames,
        )
