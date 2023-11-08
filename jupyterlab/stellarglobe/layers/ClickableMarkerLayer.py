from dataclasses import dataclass, field
from typing import Optional, Callable, List

from .._models.LayerProps.ClickableMarkerLayer import Model as Props, Marker, MarkerType
from .._models.LayerCallbacks.ClickableMarkerLayer.onClick import Model as ClickEvent
from .BaseLayer import BaseLayer
from ..callback import enable_callback


OnClick = Callable[[ClickEvent], None]


@dataclass
class ClickableMarkerLayer(BaseLayer):
    type = 'ClickableMarkerLayer'
    markers: List[Marker]
    base_color: List[float] = field(default_factory=lambda: [1, 1, 1, 1])
    default_color: List[float] = field(default_factory=lambda: [1, 1, 1, 1])
    default_type: MarkerType = 'circle'
    dimm_alpha: float = 0.75
    visible: Optional[bool] = True
    on_click: Optional[OnClick] = None

    def props(self):
        return Props(
            onClick=self.on_click and enable_callback(self.on_click),
            baseColor=self.base_color,
            defaultColor=self.default_color,
            defaultType=self.default_type,
            dimmAlpha=self.dimm_alpha,
            markers=self.markers,
            visible=self.visible,
            onHoverChange=None,
        )

    Marker = Marker
    marker_types: MarkerType = MarkerType.__args__  # type: ignore
