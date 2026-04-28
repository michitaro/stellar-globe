import { EsoMilkyWayLayer as CoreEsoMilkyWayLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, mountOndemand, setDisplayName } from "../GlobeContext"

const InnerEsoMilkyWayLayer = makePureLayerComponent<
  ConstructorParameters<typeof CoreEsoMilkyWayLayer>[1] &
  { visible?: boolean }
>((globe, options) => new CoreEsoMilkyWayLayer(globe, options), 'visible')

const EsoMilkyWayLayer = mountOndemand(InnerEsoMilkyWayLayer, 'visible')

setDisplayName({ EsoMilkyWayLayer })

export { EsoMilkyWayLayer }

/** @deprecated Use EsoMilkyWayLayer instead */
export const EsoMilkyWayLayer$ = EsoMilkyWayLayer
