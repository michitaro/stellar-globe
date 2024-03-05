from __future__ import annotations
from typing import Optional, Literal, TypedDict

P = Literal['constellation', 'esoMilkyWay', 'grid', 'hipparcosCatalog', 'nearbyGalaxiesAndNebulas', 'tracts']

class Model(TypedDict):
    payload: P
    type: Literal['appearanceLayers/visibleToggled']