import { PanLayer as CorePanLayer, RollLayer as CoreRollLayer, TouchLayer as CoreTouchLayer, ZoomLayer as CoreZoomLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../GlobeContext"

const PanLayer = makePureLayerComponent<{ enabled?: boolean }>(globe => new CorePanLayer(globe), 'enabled')
const ZoomLayer = makePureLayerComponent<{ enabled?: boolean }>(globe => new CoreZoomLayer(globe), 'enabled')
const RollLayer = makePureLayerComponent<{ enabled?: boolean }>(globe => new CoreRollLayer(globe), 'enabled')
const TouchLayer = makePureLayerComponent<{ enabled?: boolean }>(globe => new CoreTouchLayer(globe), 'enabled')

setDisplayName({ PanLayer, ZoomLayer, RollLayer, TouchLayer })

export { PanLayer, ZoomLayer, RollLayer, TouchLayer }

/** @deprecated Use PanLayer instead */
export const PanLayer$ = PanLayer
/** @deprecated Use ZoomLayer instead */
export const ZoomLayer$ = ZoomLayer
/** @deprecated Use RollLayer instead */
export const RollLayer$ = RollLayer
/** @deprecated Use TouchLayer instead */
export const TouchLayer$ = TouchLayer
