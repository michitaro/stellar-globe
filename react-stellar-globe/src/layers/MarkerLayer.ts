import { ClickableMarkerLayer, Globe, LayerConstructorRestParameters, MarkerLayer } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { useLayerBind } from ".."
import { setDisplayName } from "../Globe"


type MarkerLayerProps = ConstructorParameters<typeof MarkerLayer>[1] & {
  visible?: boolean
}

const MarkerLayer$: React.FC<MarkerLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new MarkerLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<MarkerLayer>(factory, visible)
  const { defaultColor, defaultType, markers } = options
  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers })
    })
  }, [defaultColor, defaultType, ifLayerReady, markers])
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
  const { defaultColor, defaultType, markers, dimmAlpha } = options
  useEffect(() => {
    ifLayerReady(layer => {
      layer.update({ defaultColor, defaultType, markers, dimmAlpha })
    })
  }, [defaultColor, defaultType, ifLayerReady, markers, dimmAlpha])
  return node
})

setDisplayName({ ClickableMarkerLayer$ })
export { ClickableMarkerLayer$ }
