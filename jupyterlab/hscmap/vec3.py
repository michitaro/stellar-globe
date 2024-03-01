import math
from dataclasses import dataclass
from typing import Tuple, TypedDict, List

from .angle import Angle


class SkyCooerdDict(TypedDict):
    ra: float
    dec: float


@dataclass
class SkyCoord:
    ra: Angle
    dec: Angle

    def as_dict(self) -> SkyCooerdDict:
        return {'ra': self.ra.radian, 'dec': self.dec.radian}

    def vec3(self) -> 'Vec3':
        return Vec3(
            math.cos(self.ra.radian) * math.cos(self.dec.radian),
            math.sin(self.ra.radian) * math.cos(self.dec.radian),
            math.sin(self.dec.radian),
        )


@dataclass
class Vec3:
    x: float
    y: float
    z: float

    def __add__(self, other: 'Vec3') -> 'Vec3':
        return Vec3(self.x + other.x, self.y + other.y, self.z + other.z)

    def __sub__(self, other: 'Vec3') -> 'Vec3':
        return Vec3(self.x - other.x, self.y - other.y, self.z - other.z)

    def __mul__(self, other: float) -> 'Vec3':
        return Vec3(self.x * other, self.y * other, self.z * other)

    def __rmul__(self, other: float) -> 'Vec3':
        return Vec3(self.x * other, self.y * other, self.z * other)

    def __truediv__(self, other: float) -> 'Vec3':
        return Vec3(self.x / other, self.y / other, self.z / other)

    def __neg__(self) -> 'Vec3':
        return Vec3(-self.x, -self.y, -self.z)

    def __abs__(self) -> float:
        return math.sqrt(self.x**2 + self.y**2 + self.z**2)

    def normalize(self) -> 'Vec3':
        return self / abs(self)

    def dot(self, other: 'Vec3') -> float:
        return self.x * other.x + self.y * other.y + self.z * other.z

    def cross(self, other: 'Vec3') -> 'Vec3':
        return Vec3(
            self.y * other.z - self.z * other.y,
            self.z * other.x - self.x * other.z,
            self.x * other.y - self.y * other.x,
        )

    def angle(self, other: 'Vec3') -> Angle:
        return Angle(math.acos(self.dot(other) / (abs(self) * abs(other))))

    def as_tuple(self) -> Tuple[float, float, float]:
        return (self.x, self.y, self.z)

    def as_list(self) -> List[float]:
        return [self.x, self.y, self.z]
