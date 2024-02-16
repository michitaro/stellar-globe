from typing import Literal
import math


deg2rad = math.pi / 180
rad2deg = 180 / math.pi


class Angle:
    Unit = Literal['degree', 'radian']

    def __init__(self, radian: float):
        self._radian = radian

    @property
    def degree(self):
        return rad2deg * self._radian

    @property
    def radian(self):
        return self._radian

    @classmethod
    def from_degree(cls, degree: float):
        return cls(deg2rad * degree)

    @classmethod
    def from_radian(cls, radian: float):
        return cls(radian)

    @classmethod
    def converter(cls, unit: Unit):
        if unit == 'degree':
            angle_input = cls.from_degree
            angle_output = _as_degree
        else:
            angle_input = cls.from_radian
            angle_output = _as_radian
        return angle_input, angle_output


def _as_degree(angle: Angle):
    return angle.degree


def _as_radian(angle: Angle):
    return angle.radian
