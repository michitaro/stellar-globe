from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Union
# from typing_extensions import Literal, NotRequired, TypedDict

class PartialConstellationLayerProps(TypedDict):
    fadeInDuration: Optional[float]
    lang: Optional[Literal['English', 'Hiragana', 'Kanji']]
    nameColor: Optional[str]
    nameFont: Optional[str]
    showLines: Optional[bool]
    showNames: Optional[bool]
    visible: Optional[bool]

class PartialFadeInDurationNumberUndefinedImageSize5121024UndefinedVisibleBooleanUndefined(TypedDict):
    fadeInDuration: Optional[float]
    imageSize: Optional[Literal[1024, 512]]
    visible: Optional[bool]

class PartialVisibleBooleanFrameBooleanPatchBoolean(TypedDict):
    frame: Optional[bool]
    patch: Optional[bool]
    visible: Optional[bool]

class PartialVisibleBoolean1(TypedDict):
    visible: Optional[bool]

class PartialVisibleBoolean(TypedDict):
    visible: Optional[bool]
Which = Literal['constellation', 'esoMilkyWay', 'grid', 'hipparcosCatalog', 'nearbyGalaxiesAndNebulas', 'tracts']

class PartialVisibleTrue(TypedDict):
    visible: Optional[bool]
PartialVisibleBooleanFadeInDurationNumberUndefinedImageSize5121024UndefinedVisibleBooleanUndefinedConstellationLayerPropsVisibleTrueVisibleBooleanVisibleBooleanFrameBooleanPatchBoolean = Union[PartialConstellationLayerProps, PartialVisibleBoolean, PartialFadeInDurationNumberUndefinedImageSize5121024UndefinedVisibleBooleanUndefined, PartialVisibleTrue, PartialVisibleBoolean1, PartialVisibleBooleanFrameBooleanPatchBoolean]

class Payload(TypedDict):
    props: PartialVisibleBooleanFadeInDurationNumberUndefinedImageSize5121024UndefinedVisibleBooleanUndefinedConstellationLayerPropsVisibleTrueVisibleBooleanVisibleBooleanFrameBooleanPatchBoolean
    which: Which

class Model(TypedDict):
    payload: Payload
    type: Literal['appearanceLayers/propsUpdated']