from hscmap import Window
import pytest


@pytest.mark.skip
def test_camera_jump_to(w: Window):
    pass


def test_camera_params_get(w: Window):
    assert w.camera.params is not None


def test_camera_center_get(w: Window):
    assert w.camera.center is not None


def test_camera_fov_get(w: Window):
    assert w.camera.fov is not None
