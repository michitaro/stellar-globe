import { ConstellationLayer as CoreConstellationLayer, Globe } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { setDisplayName, useLayerBind } from "../GlobeContext"


type ConstellationLayerProps = NonNullable<ConstructorParameters<typeof CoreConstellationLayer>[1]> & { visible?: boolean }

const ConstellationLayer: React.FC<ConstellationLayerProps> = memo(props => {
  const { visible = true, ...options } = { ...CoreConstellationLayer.defaultOptions(), ...props }
  const {
    lang, nameColor, nameFont, showLines, showNames,
  } = options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new CoreConstellationLayer(globe, options), [lang, nameColor, nameFont])
  const { node, ifLayerReady } = useLayerBind<CoreConstellationLayer>(factory, visible)

  useEffect(() => {
    ifLayerReady(layer => {
      layer.showLines = showLines
      layer.showNames = showNames
      layer.globe.requestRefresh()
    })
  }, [ifLayerReady, showLines, showNames])

  return node
})

setDisplayName({ ConstellationLayer })

export { ConstellationLayer }

/** @deprecated Use ConstellationLayer instead */
export const ConstellationLayer$ = ConstellationLayer
