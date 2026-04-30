import { BeautifulObjectLayer as CoreBeautifulObjectLayer } from "@stellar-globe/stellar-globe"
import { makePureLayerComponent, mountOndemand, setDisplayName } from "../GlobeContext"
import { memo } from "react"

const One = mountOndemand(makePureLayerComponent<
  {
    which: ConstructorParameters<typeof CoreBeautifulObjectLayer>[1]
    visible?: boolean
  }
>((globe, { which }) => new CoreBeautifulObjectLayer(globe, which), 'visible'), 'visible')

type Props = {
  visible?: boolean
}

const BeautifulObjectLayer = memo(({ visible }: Props) => {
  return (
    <>
      <One visible={visible} which='m31' />
      <One visible={visible} which='m42' />
      <One visible={visible} which='m45' />
      <One visible={visible} which='m101' />
      <One visible={visible} which='perseus' />
    </>
  )
})

setDisplayName({ BeautifulObjectLayer })
export { BeautifulObjectLayer }

/** @deprecated Use BeautifulObjectLayer instead */
export const BeautifulObjectLayer$ = BeautifulObjectLayer
