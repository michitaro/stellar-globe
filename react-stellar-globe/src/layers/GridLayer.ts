import { GridLayer as CoreGridLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../GlobeContext"

type GridLayerOptionsManipulator = ConstructorParameters<typeof CoreGridLayer>[1]

const GridLayer = makePureLayerComponent<{
  optionsManipulate?: GridLayerOptionsManipulator
  visible?: boolean
}>(
  (globe, { optionsManipulate }) => new CoreGridLayer(globe, optionsManipulate),
  'visible',
)

setDisplayName({ GridLayer })

export { GridLayer }

/** @deprecated Use GridLayer instead */
export const GridLayer$ = GridLayer
