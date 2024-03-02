import math

from hscmap.vec3 import Vec3


def test_addition():
    v1 = Vec3(1, 2, 3)
    v2 = Vec3(4, 5, 6)
    result = v1 + v2
    assert result == Vec3(5, 7, 9)


def test_subtraction():
    v1 = Vec3(1, 2, 3)
    v2 = Vec3(4, 5, 6)
    result = v1 - v2
    assert result == Vec3(-3, -3, -3)


def test_multiplication():
    v1 = Vec3(1, 2, 3)
    scalar = 2
    result = v1 * scalar
    assert result == Vec3(2, 4, 6)


def test_division():
    v1 = Vec3(1, 2, 3)
    scalar = 2
    result = v1 / scalar
    assert result == Vec3(0.5, 1, 1.5)


def test_negation():
    v1 = Vec3(1, 2, 3)
    result = -v1
    assert result == Vec3(-1, -2, -3)


def test_absolute_value():
    v1 = Vec3(3, 4, 0)
    result = abs(v1)
    assert result == 5.0


def test_normalize():
    v1 = Vec3(3, 4, 0)
    result = v1.normalize()
    assert math.isclose(result.x, 0.6)
    assert math.isclose(result.y, 0.8)
    assert math.isclose(result.z, 0.0)


def test_dot_product():
    v1 = Vec3(1, 2, 3)
    v2 = Vec3(4, 5, 6)
    result = v1.dot(v2)
    assert result == 32


def test_cross_product():
    v1 = Vec3(1, 2, 3)
    v2 = Vec3(4, 5, 6)
    result = v1.cross(v2)
    assert result == Vec3(-3, 6, -3)


def test_angle():
    v1 = Vec3(1, 0, 0)
    v2 = Vec3(0, 1, 0)
    result = v1.angle(v2)
    assert math.isclose(result.radian, math.pi / 2)
