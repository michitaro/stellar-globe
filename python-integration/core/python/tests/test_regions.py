from hscmap.window import Window
from hscmap.comm.reference import ReferenceCommOptions
import pytest


def test_regions(w: Window):
    w.regions


def test_regions_new_text(w: Window):
    w.regions.new_text(position=(0, 0), text="test", color=[1, 0, 0, 1])


# def test_regions_new_circle(w: Window):
#     center = (0.0, 0.0)
#     radius = 1.0
#     color = [0.5, 0.5, 0.5, 1.0]
#     name = "circle"
#     w.regions.new_circle(name=name, center=center, radius=radius, color=color)
#     # assert isinstance(w.regions.members[0], w.regions.TextRegion)
