from __future__ import annotations
from typing import Optional, Literal, TypedDict
# from typing_extensions import Literal, NotRequired, TypedDict

class Model(TypedDict):
    payload: Literal['constellation', 'esoMilkyWay', 'grid', 'hipparcosCatalog', 'nearbyGalaxiesAndNebulas', 'tracts']
    type: Literal['appearanceLayers/visibleToggled']