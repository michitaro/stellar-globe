import { Globe, GlobeHandle } from './Globe'
import { makePureLayerComponent, mountOndemand, useGetGlobe, useLayerBind } from "./GlobeContext"
import { LogScaleRange } from "./LogScaleRange"
import { BeautifulObjectLayer } from './layers/BeautifulObjectsLayer'
import { ConstellationLayer } from "./layers/ConstellationLayer"
import { PanLayer, RollLayer, TouchLayer, ZoomLayer } from './layers/ControlLayers'
import { EsoMilkyWayLayer } from "./layers/EsoMilkyWayLayer"
import { GlobeEventLayer } from './layers/GlobeEventLayer'
import { GridLayer } from "./layers/GridLayer"
import { HipparcosCatalogLayer } from "./layers/HipparcosCatalogLayer"
import { HipsSimpleLayer } from './layers/HipsSimpleLayer'
import { ClickableMarkerLayer, MarkerLayer } from "./layers/MarkerLayer"
import { PathLayer } from "./layers/PathLayer"
import { TextLayer, alwaysOne } from "./layers/TextLayer"
import { TractTileLayer } from "./layers/TractTileLayer"
import { DomLayer } from './layers/DomLayer'

export {
  BeautifulObjectLayer, ClickableMarkerLayer,
  ConstellationLayer,
  makePureLayerComponent,
  useGetGlobe,
  EsoMilkyWayLayer, Globe, GlobeEventLayer, GridLayer,
  HipparcosCatalogLayer,
  DomLayer,
  HipsSimpleLayer, LogScaleRange, MarkerLayer, PanLayer, PathLayer, RollLayer, TextLayer, TouchLayer, TractTileLayer, ZoomLayer, alwaysOne, mountOndemand, useLayerBind,
}

export type { GlobeHandle }

// Deprecated exports (for backward compatibility)
import { Globe$ } from './Globe'
import { BeautifulObjectLayer$ } from './layers/BeautifulObjectsLayer'
import { ConstellationLayer$ } from "./layers/ConstellationLayer"
import { PanLayer$, RollLayer$, TouchLayer$, ZoomLayer$ } from './layers/ControlLayers'
import { EsoMilkyWayLayer$ } from "./layers/EsoMilkyWayLayer"
import { GlobeEventLayer$ } from './layers/GlobeEventLayer'
import { GridLayer$ } from "./layers/GridLayer"
import { HipparcosCatalogLayer$ } from "./layers/HipparcosCatalogLayer"
import { HipsSimpleLayer$ } from './layers/HipsSimpleLayer'
import { ClickableMarkerLayer$, MarkerLayer$ } from "./layers/MarkerLayer"
import { PathLayer$ } from "./layers/PathLayer"
import { TextLayer$ } from "./layers/TextLayer"
import { TractTileLayer$ } from "./layers/TractTileLayer"
import { DomLayer$ } from './layers/DomLayer'

export {
  /** @deprecated Use BeautifulObjectLayer instead */
  BeautifulObjectLayer$,
  /** @deprecated Use ClickableMarkerLayer instead */
  ClickableMarkerLayer$,
  /** @deprecated Use ConstellationLayer instead */
  ConstellationLayer$,
  /** @deprecated Use EsoMilkyWayLayer instead */
  EsoMilkyWayLayer$,
  /** @deprecated Use Globe instead */
  Globe$,
  /** @deprecated Use GlobeEventLayer instead */
  GlobeEventLayer$,
  /** @deprecated Use GridLayer instead */
  GridLayer$,
  /** @deprecated Use HipparcosCatalogLayer instead */
  HipparcosCatalogLayer$,
  /** @deprecated Use DomLayer instead */
  DomLayer$,
  /** @deprecated Use HipsSimpleLayer instead */
  HipsSimpleLayer$,
  /** @deprecated Use MarkerLayer instead */
  MarkerLayer$,
  /** @deprecated Use PanLayer instead */
  PanLayer$,
  /** @deprecated Use PathLayer instead */
  PathLayer$,
  /** @deprecated Use RollLayer instead */
  RollLayer$,
  /** @deprecated Use TextLayer instead */
  TextLayer$,
  /** @deprecated Use TouchLayer instead */
  TouchLayer$,
  /** @deprecated Use TractTileLayer instead */
  TractTileLayer$,
  /** @deprecated Use ZoomLayer instead */
  ZoomLayer$,
}
