from .angle import Angle

import time
from dataclasses import dataclass
from typing import Optional, Literal, Tuple
from .window import Window
from .models.JumpTo import Model as JumpToMessage


@dataclass
class Camera:
    _w: Window

    def jump_to(
        self,
        ra: float,
        dec: float,
        *,
        fov: Optional[float] = None,
        duration=0.2,
        non_block=False,
        easing: Optional[Literal['fastStart2', 'fastStart4', 'linear', 'slowStart2', 'slowStart4', 'slowStartStop2', 'slowStartStop4']] = None,
    ):
        self._w._post_message(
            JumpToMessage(
                type='JumpTo',
                ra=self._w._angle_input(ra).radian,
                dec=self._w._angle_input(dec).radian,
                fov=self._w._angle_input(fov).radian if fov is not None else None,
                duration=duration,
                easingFunction=easing,  # type: ignore
            )
        )
        if not non_block:
            time.sleep(duration)

    def _sync(self):
        self._w.sync(only_if_needed=True)

    @property
    def params(self):
        self._sync()
        return self._w._store_state['camera']['params']

    @property
    def center(self) -> Tuple[float, float]:
        self._sync()
        ra, dec = [Angle(a) for a in self._w._store_state['computed']['center']]
        return (
            self._w._angle_output(ra),
            self._w._angle_output(dec),
        )

    @center.setter
    def center(self, value: Tuple[float, float]):
        self.jump_to(*value, fov=self.fov)

    @property
    def fov(self) -> float:
        fov = Angle(self.params['fovy'])
        return self._w._angle_output(fov)

    @fov.setter
    def fov(self, value: float):
        self.jump_to(*self.center, fov=value)
