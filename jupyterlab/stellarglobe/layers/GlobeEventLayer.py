from dataclasses import dataclass
from typing import Callable, Optional
from ..utils.unit import rad2deg

from .._models.LayerCallbacks.GlobeEventLayer.onCameraMove import Model as NativeCameraMoveEvent
from .._models.LayerProps.GlobeEventLayer import Model as Props
from ..callback import enable_callback
from ..utils.unit import s2ms
from .BaseLayer import BaseLayer


@dataclass
class SkyCoord:
    dec: float  # in degree
    ra: float  # in degree

    @classmethod
    def from_rad(cls, ra: float, dec: float):
        return SkyCoord(ra=ra * rad2deg, dec=dec * rad2deg)


@dataclass
class CameraMoveEvent:
    fov: float  # in degree
    roll: float  # in degree
    sky_coord: SkyCoord

    @classmethod
    def from_native(cls, native: NativeCameraMoveEvent):
        return CameraMoveEvent(
            fov=native['fovy'] * rad2deg,
            roll=native['roll'] * rad2deg,
            sky_coord=SkyCoord.from_rad(**native['skyCoord']),
        )


OnCameraMoveEnd = Callable[[CameraMoveEvent], None]


@dataclass
class GlobeEventLayer(BaseLayer):
    type = 'GlobeEventLayer'
    # on_camera_mode_change: Optional[OnCameraModeChange]
    on_camera_move_end: Optional[OnCameraMoveEnd]
    # on_camera_move_start: Optional[OnCameraMoveStart]
    # on_image_loaded: Optional[OnImageLoaded]
    # on_resize: Optional[OnResize]
    on_camera_move_end_debounce: float = 0.2

    def props(self):
        return Props(
            onCameraModeChange=None,
            onCameraMoveEnd=None,
            # ↓ This is intended. Debounced onCameraMove is equivalent to on-camera-move-end
            onCameraMove=self.on_camera_move_end
            and enable_callback(
                self.on_camera_move_end,
                debounce=self.on_camera_move_end_debounce * s2ms,
                event_converter=CameraMoveEvent.from_native,
            ),
            onCameraMoveStart=None,
            onImageLoaded=None,
            onResize=None,
        )
