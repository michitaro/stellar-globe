from dataclasses import dataclass
from typing import Literal, Optional

from .._models.LayerProps.ConstellationLayer import Model as Props
from ..utils.unit import s2ms
from .BaseLayer import BaseLayer


@dataclass
class ConstellationLayer(BaseLayer):
    type = 'ConstellationLayer'

    fade_in_duration: Optional[float] = None
    lang: Optional[Literal['Hiragana', 'Kanji', 'English']] = 'English'
    name_color: Optional[str] = None
    name_font: Optional[str] = None
    show_lines: bool = True
    show_names: bool = False
    visible: bool = True

    def props(self):
        return Props(
            visible=self.visible,
            fadeInDuration=self.fade_in_duration and self.fade_in_duration * s2ms,
            lang=self.lang,
            nameColor=self.name_color,
            nameFont=self.name_font,
            showLines=self.show_lines,
            showNames=self.show_names,
        )
