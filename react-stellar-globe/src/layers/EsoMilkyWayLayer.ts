import { EsoMilkyWayLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../Globe"

const EsoMilkyWayLayer$ = makePureLayerComponent<
  ConstructorParameters<typeof EsoMilkyWayLayer>[1] &
  { visible?: boolean} 
>((globe, { visible, ...options }) => new EsoMilkyWayLayer(globe, options), 'visible')

setDisplayName({ EsoMilkyWayLayer$ })

export { EsoMilkyWayLayer$ }
