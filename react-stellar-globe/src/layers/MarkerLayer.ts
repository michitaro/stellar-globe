import { ClickableMarkerLayer as CoreClickableMarkerLayer, Globe, MarkerLayer as CoreMarkerLayer } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { useLayerBind } from ".."
import { setDisplayName } from "../GlobeContext"


type MarkerLayerProps = ConstructorParameters<typeof CoreMarkerLayer>[1] & {
  visible?: boolean
}

const MarkerLayer: React.FC<MarkerLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new CoreMarkerLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<CoreMarkerLayer>(factory, visible)
  const { defaultColor, defaultType, markers, baseColor, markerSize, markerWidth } = options

  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers, markerSize, markerWidth })
    })
  }, [defaultColor, defaultType, ifLayerReady, markerSize, markerWidth, markers])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.baseColor = baseColor
      layer.globe.requestRefresh()
    })
  }, [baseColor, ifLayerReady])

  return node
})

setDisplayName({ MarkerLayer })
export { MarkerLayer }

/** @deprecated Use MarkerLayer instead */
export const MarkerLayer$ = MarkerLayer


type ClickableMarkerLayerProps = ConstructorParameters<typeof CoreClickableMarkerLayer>[1] & {
  visible?: boolean
}

const ClickableMarkerLayer: React.FC<ClickableMarkerLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new CoreClickableMarkerLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<CoreClickableMarkerLayer>(factory, visible)
  const { defaultColor, defaultType, markers, dimmAlpha, onClick, onHoverChange, baseColor, markerSize, markerWidth } = options

  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers, markerSize, markerWidth })
    })
  }, [defaultColor, defaultType, ifLayerReady, markers, dimmAlpha, markerSize, markerWidth])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.dimmAlpha = dimmAlpha
      layer.baseColor = baseColor
      layer.onClick = onClick
      layer.onHoverChange = onHoverChange
      layer.globe.requestRefresh()
    })
  }, [baseColor, dimmAlpha, ifLayerReady, onClick, onHoverChange])

  return node
})

setDisplayName({ ClickableMarkerLayer })
export { ClickableMarkerLayer }

/** @deprecated Use ClickableMarkerLayer instead */
export const ClickableMarkerLayer$ = ClickableMarkerLayer
