import { useLayerBind } from "@stellar-globe/react-stellar-globe"
import { Globe, V4, fits } from "@stellar-globe/stellar-globe"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { FitsMaskImageLayer } from "."
import { useIsMounted } from "../../../../common/hooks/useIsMounted"

type Props = {
  url: string
  hduIndex?: number
  hduIndexChanged?: (hduIndex: number) => void
  visible?: boolean
  maskBit: number
  color: V4
}


export function FitsImageLayer$(props: Props) {
  const isMounted = useIsMounted()
  const { url, hduIndex, hduIndexChanged } = props
  const [cache, setCache] = useState<fits.Hdu[] | undefined>()
  useEffect(() => {
    (async () => {
      const hdul = await fits.Fits.fetch(url)
      console.log(isMounted())
      if (isMounted() && url === props.url) {
        const newHduIndex = find2dHdu(hdul)
        hduIndexChanged?.(newHduIndex)
        setCache(hdul)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url, url])
  const hdu = useMemo(() => cache?.[hduIndex ?? 0], [cache, hduIndex])
  if (hdu && hdu.card('BITPIX', 'number') >= 0) {
    return <SafeFitsMaskImageLayer visible={props.visible} hdu={hdu} maskBit={props.maskBit} color={props.color} />
  }
}


function find2dHdu(hdul: fits.Hdu[]) {
  return 0
  for (let i = 0; i < hdul.length; ++i) {
    try {
      if (hdul[i].card('NAXIS', 'number') === 2) {
        return i
      }
    }
    catch {
      continue
    }
  }
  return -1
}


const SafeFitsMaskImageLayer: React.FC<{
  hdu: fits.Hdu
  visible?: boolean
  maskBit: number
  color: V4
}> = memo(({ hdu, color, maskBit, visible = true }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new FitsMaskImageLayer(globe, { hdu, color, maskBit }), [hdu, maskBit])
  const { node, ifLayerReady } = useLayerBind<FitsMaskImageLayer>(factory, visible)
  useEffect(() => {
    ifLayerReady(layer => {
      layer.changeColor(color)
    })
  }, [color, ifLayerReady])
  return node
})
