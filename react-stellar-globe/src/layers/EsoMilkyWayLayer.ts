import { EsoMilkyWayLayer as CoreEsoMilkyWayLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../GlobeContext"

const EsoMilkyWayLayer = makePureLayerComponent<
  ConstructorParameters<typeof CoreEsoMilkyWayLayer>[1] &
  { visible?: boolean }
>((globe, options) => new CoreEsoMilkyWayLayer(globe, options), 'visible')

setDisplayName({ EsoMilkyWayLayer })

export { EsoMilkyWayLayer }

/** @deprecated Use EsoMilkyWayLayer instead */
export const EsoMilkyWayLayer$ = EsoMilkyWayLayer
