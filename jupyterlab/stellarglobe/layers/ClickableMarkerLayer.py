from dataclasses import dataclass, field
from typing import Optional, Callable

from .._models.LayerProps.ClickableMarkerLayer import Model as Props, Marker, MarkerType
from .._models.LayerCallbacks.ClickableMarkerLayer.onClick import Model as OnClickEvent
from .BaseLayer import BaseLayer
from ..callback import enable_callback


OnClick = Callable[[OnClickEvent], None]


@dataclass
class ClickableMarkerLayer(BaseLayer):
    type = 'ClickableMarkerLayer'
    markers: list[Marker]
    baseColor: list[float] = field(default_factory=lambda: [1, 1, 1, 1])
    defaultColor: list[float] = field(default_factory=lambda: [1, 1, 1, 1])
    defaultType: MarkerType = 'circle'
    dimmAlpha: float = 0.75
    visible: Optional[bool] = True
    onClick: Optional[OnClick] = None

    def props(self):
        return Props(
            onClick=self.onClick and enable_callback(self.onClick),
            baseColor=self.baseColor,
            defaultColor=self.defaultColor,
            defaultType=self.defaultType,
            dimmAlpha=self.dimmAlpha,
            markers=self.markers,
            visible=self.visible,
        )

    Marker = Marker
    marker_types: MarkerType = MarkerType.__args__  # type: ignore
