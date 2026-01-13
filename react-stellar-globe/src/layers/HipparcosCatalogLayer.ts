import { HipparcosCatalogLayer as CoreHipparcosCatalogLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../GlobeContext"

const HipparcosCatalogLayer = makePureLayerComponent<{
  visible?: boolean
}>(
  globe => new CoreHipparcosCatalogLayer(globe),
  'visible',
)

setDisplayName({ HipparcosCatalogLayer })
export { HipparcosCatalogLayer }

/** @deprecated Use HipparcosCatalogLayer instead */
export const HipparcosCatalogLayer$ = HipparcosCatalogLayer
