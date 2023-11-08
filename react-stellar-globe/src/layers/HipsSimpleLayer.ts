import { hips } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, setDisplayName } from "../GlobeContext"


const HipsSimpleLayer$ = makePureLayerComponent<{
  visible?: boolean,
  baseUrl: string,
}>(
  (globe, { baseUrl }) => new hips.SimpleImageLayer(globe, baseUrl),
  'visible',
)


setDisplayName({ HipsSimpleLayer$ })
export { HipsSimpleLayer$ }
