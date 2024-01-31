from __future__ import annotations
from typing import Optional, Literal
from typing import List, Union
from typing_extensions import Literal, NotRequired, TypedDict

class EsoMilkyWay(TypedDict):
    fadeInDuration: Optional[float]
    imageSize: Optional[Literal[1024, 512]]
    visible: Optional[bool]

class Grid(TypedDict):
    visible: bool

class HipparcosCatalog(TypedDict):
    visible: bool

class NearbyGalaxiesAndNebulas(TypedDict):
    visible: Optional[bool]

class Tracts(TypedDict):
    frame: bool
    patch: bool
    visible: bool

class Marker(TypedDict):
    color: Optional[List[float]]
    position: List[float]
    type: Optional[Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']]

class Computed(TypedDict):
    center: List[float]

class Devel(TypedDict):
    enabled: bool
    profilerActive: bool
    profilerSupported: bool

class HipsLayers(TypedDict):
    baseUrl: str
    hipsDialogVisible: bool

class InitializerParams(TypedDict):
    storageKey: str

class Layer(TypedDict):
    baseUrl: str
    name: str
    visible: bool

class ConstellationLayerProps(TypedDict):
    fadeInDuration: Optional[float]
    lang: Optional[Literal['English', 'Hiragana', 'Kanji']]
    nameColor: Optional[str]
    nameFont: Optional[str]
    showLines: Optional[bool]
    showNames: Optional[bool]
    visible: Optional[bool]
AngleUnit = Literal['degree', 'radian', 'sexadecimal']
MarkerType = Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']

class CameraParams(TypedDict):
    fovy: float
    phi: float
    roll: float
    theta: float
    za: float
    zd: float
    zp: float

class PartialRecordTopBottomLeftRightNumber(TypedDict):
    bottom: Optional[float]
    left: Optional[float]
    right: Optional[float]
    top: Optional[float]

class End(TypedDict):
    dec: float
    ra: float

class Start(TypedDict):
    dec: float
    ra: float

class LinearRegion(TypedDict):
    color: List[float]
    end: End
    id: str
    name: str
    showLabel: bool
    start: Start
    type: Optional[str]
    visible: bool

class RectangularRegion(TypedDict):
    color: List[float]
    id: str
    maxDec: float
    maxRa: float
    minDec: float
    minRa: float
    name: str
    showLabel: bool
    type: Optional[str]
    visible: bool
ToolType = Literal['circle', 'line', 'pan', 'rect', 'text']

class Position(TypedDict):
    dec: float
    ra: float

class TextRegion(TypedDict):
    color: List[float]
    id: str
    name: str
    position: Position
    showLabel: bool
    type: Optional[str]
    visible: bool
CameraMode = Literal['FLOATING_EYE', 'GNOMONIC', 'STEREOGRAPHIC']

class SimpleRgb(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams1(TypedDict):
    filters: List[str]
    simpleRgb: SimpleRgb
    type: str

class SimpleColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams2(TypedDict):
    filters: List[str]
    simpleColorMatrix: SimpleColorMatrix
    type: str

class SdssTrueColor(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams3(TypedDict):
    filters: List[str]
    sdssTrueColor: SdssTrueColor
    type: str

class SdssTrueColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams4(TypedDict):
    filters: List[str]
    sdssTrueColorMatrix: SdssTrueColorMatrix
    type: str
SspTileParams = Union[SspTileParams1, SspTileParams2, SspTileParams3, SspTileParams4]

class Center(TypedDict):
    dec: float
    ra: float

class CircularRegion(TypedDict):
    center: Center
    color: List[float]
    id: str
    name: str
    radius: float
    showLabel: bool
    type: Optional[str]
    visible: bool

class AppearanceLayers(TypedDict):
    constellation: ConstellationLayerProps
    esoMilkyWay: EsoMilkyWay
    grid: Grid
    hipparcosCatalog: HipparcosCatalog
    nearbyGalaxiesAndNebulas: NearbyGalaxiesAndNebulas
    tracts: Tracts

class Camera(TypedDict):
    params: CameraParams
    projection: CameraMode
    retina: bool

class Catalog(TypedDict):
    attributes: List[List[str]]
    baseColor: List[float]
    defaultColor: List[float]
    defaultType: MarkerType
    fields: List[str]
    hasColorCol: bool
    hasMarkerTypeCol: bool
    id: str
    markers: List[Marker]
    name: str
    visible: bool

class Catalogs(TypedDict):
    autoColor: bool
    catalogs: List[Catalog]
    catalogsDialogVisible: bool
    currentCatalogId: str

class Common(TypedDict):
    angleUnit: AngleUnit
    dialogPositionHint: PartialRecordTopBottomLeftRightNumber

class TractTileLayers(TypedDict):
    colorParams: SspTileParams
    layers: List[Layer]
    toneDialogVisible: bool
Region = Union[LinearRegion, CircularRegion, RectangularRegion, TextRegion]

class Regions(TypedDict):
    autoColor: bool
    regions: List[Region]
    regionsDialogVisible: bool
    tool: ToolType
    toolPinned: bool

class Model(TypedDict):
    appearanceLayers: AppearanceLayers
    camera: Camera
    catalogs: Catalogs
    common: Common
    computed: Computed
    devel: Devel
    hipsLayers: HipsLayers
    initializerParams: InitializerParams
    regions: Regions
    tractTileLayers: TractTileLayers