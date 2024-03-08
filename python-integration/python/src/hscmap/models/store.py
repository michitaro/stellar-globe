from __future__ import annotations
from typing import Optional, Literal, TypedDict
from typing import Dict, List, Union


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

class Dialog(TypedDict):
    checked: Dict[str, bool]
    opened: bool

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
    showHipsDialogWhenBaseUrlChanged: bool

class InitializerParams(TypedDict):
    storageKey: str

class Layer(TypedDict):
    baseUrl: str
    name: str
    visible: bool

class SimpleRgb(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams1(TypedDict):
    filters: List[str]
    simpleRgb: SimpleRgb
    type: Optional[str]

class SimpleColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams2(TypedDict):
    filters: List[str]
    simpleColorMatrix: SimpleColorMatrix
    type: Optional[str]

class SdssTrueColor(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float

class SspTileParams3(TypedDict):
    filters: List[str]
    sdssTrueColor: SdssTrueColor
    type: Optional[str]

class SdssTrueColorMatrix(TypedDict):
    a: float
    b0: float
    beta: float
    bias: float
    colors: List[List[float]]

class SspTileParams4(TypedDict):
    filters: List[str]
    sdssTrueColorMatrix: SdssTrueColorMatrix
    type: Optional[str]
SspTileParams = Union[SspTileParams1, SspTileParams2, SspTileParams3, SspTileParams4]

class Point(TypedDict):
    color: List[float]
    position: List[float]
    size: float

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

class CameraParams(TypedDict):
    fovy: float
    phi: float
    roll: float
    theta: float
    za: float
    zd: float
    zp: float
MarkerType = Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']

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
AngleUnit = Literal['degree', 'radian', 'sexadecimal']
ToolType = Literal['circle', 'line', 'pan', 'path', 'rect', 'text']
CameraMode = Literal['FLOATING_EYE', 'GNOMONIC', 'STEREOGRAPHIC']

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

class PartialRecordTopBottomLeftRightNumber(TypedDict):
    bottom: Optional[float]
    left: Optional[float]
    right: Optional[float]
    top: Optional[float]

class ConstellationLayerProps(TypedDict):
    fadeInDuration: Optional[float]
    lang: Optional[Literal['English', 'Hiragana', 'Kanji']]
    nameColor: Optional[str]
    nameFont: Optional[str]
    showLines: Optional[bool]
    showNames: Optional[bool]
    visible: Optional[bool]
JOINT = Literal['MITER', 'NONE']

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
    dialog: Dialog
    fields: List[str]
    id: str
    markers: List[Marker]
    name: str
    selectedRecords: Dict[str, bool]
    visible: bool

class Catalogs(TypedDict):
    autoColor: bool
    catalogs: List[Catalog]
    catalogsDialogVisible: bool
    currentCatalogId: str
    focusedPosition: List[float]

class Common(TypedDict):
    angleUnit: AngleUnit
    dialogPositionHint: PartialRecordTopBottomLeftRightNumber

class TractTileLayers(TypedDict):
    colorParams: SspTileParams
    layers: List[Layer]
    toneDialogVisible: bool

class Path(TypedDict):
    close: bool
    joint: JOINT
    points: List[Point]

class PathRegion(TypedDict):
    color: List[float]
    id: str
    name: str
    paths: List[Path]
    showLabel: bool
    type: Optional[str]
    visible: bool
Region = Union[LinearRegion, CircularRegion, RectangularRegion, TextRegion, PathRegion]

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