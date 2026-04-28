import { HipparcosCatalogLayer as CoreHipparcosCatalogLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, mountOndemand, setDisplayName } from "../GlobeContext"

const InnerHipparcosCatalogLayer = makePureLayerComponent<{
  visible?: boolean
}>(
  globe => new CoreHipparcosCatalogLayer(globe),
  'visible',
)

const HipparcosCatalogLayer = mountOndemand(InnerHipparcosCatalogLayer, 'visible')

setDisplayName({ HipparcosCatalogLayer })
export { HipparcosCatalogLayer }

/** @deprecated Use HipparcosCatalogLayer instead */
export const HipparcosCatalogLayer$ = HipparcosCatalogLayer
