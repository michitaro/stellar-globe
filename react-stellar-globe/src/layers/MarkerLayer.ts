import { ClickableMarkerLayer, Globe, MarkerLayer } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { useLayerBind } from ".."
import { setDisplayName } from "../GlobeContext"


type MarkerLayerProps = ConstructorParameters<typeof MarkerLayer>[1] & {
  visible?: boolean
}

const MarkerLayer$: React.FC<MarkerLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new MarkerLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<MarkerLayer>(factory, visible)
  const { defaultColor, defaultType, markers, baseColor } = options

  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers })
    })
  }, [defaultColor, defaultType, ifLayerReady, markers])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.baseColor = baseColor
    })
  }, [baseColor, ifLayerReady])

  return node
})

setDisplayName({ MarkerLayer$ })
export { MarkerLayer$ }



type ClickableMarkerLayerProps = ConstructorParameters<typeof ClickableMarkerLayer>[1] & {
  visible?: boolean
}

const ClickableMarkerLayer$: React.FC<ClickableMarkerLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new ClickableMarkerLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<ClickableMarkerLayer>(factory, visible)
  const { defaultColor, defaultType, markers, dimmAlpha, onClick, onHoverChange, baseColor } = options

  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers })
    })
  }, [defaultColor, defaultType, ifLayerReady, markers, dimmAlpha])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.dimmAlpha = dimmAlpha
      layer.baseColor = baseColor
      layer.onClick = onClick
      layer.onHoverChange = onHoverChange
    })
  }, [baseColor, dimmAlpha, ifLayerReady, onClick, onHoverChange])

  return node
})

setDisplayName({ ClickableMarkerLayer$ })
export { ClickableMarkerLayer$ }
