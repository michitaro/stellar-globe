import { Globe$, GlobeHandle, useLayerBind } from "./Globe"
import { LogScaleRange } from "./LogScaleRange"
import { ConstellationLayer$ } from "./layers/ConstellationLayer"
import { EsoMilkyWayLayer$ } from "./layers/EsoMilkyWayLayer"
import { GridLayer$ } from "./layers/GridLayer"
import { HipparcosCatalogLayer$ } from "./layers/HipparcosCatalogLayer"
import { HipsSimpleLayer$ } from './layers/HipsSimpleLayer'
import { ClickableMarkerLayer$, MarkerLayer$ } from "./layers/MarkerLayer"
import { SspTileLayer$ } from "./layers/SspTileLayer"
import { TextLayer$, alwaysOne } from "./layers/TextLayer"

export {
  ClickableMarkerLayer$, ConstellationLayer$,
  EsoMilkyWayLayer$, Globe$, GridLayer$,
  HipparcosCatalogLayer$,
  HipsSimpleLayer$, LogScaleRange, MarkerLayer$, SspTileLayer$,
  TextLayer$, alwaysOne, useLayerBind
}

export type { GlobeHandle }

import * as MessageControllableGlobe from './MessageControllableGlobe'
export { MessageControllableGlobe }
