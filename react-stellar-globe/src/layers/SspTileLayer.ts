import { Globe, SspTileLayer } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { setDisplayName, useLayerBind } from "../Globe"

type SspTileLayerProps = ConstructorParameters<typeof SspTileLayer>[1] & {
  visible?: boolean
}
const SspTileLayer$: React.FC<SspTileLayerProps> = memo(props => {
  const {
    baseUrl, colorParams = SspTileLayer.defaultParams('sdssTrueColor'), filters, outline = false, visible = true,
  } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new SspTileLayer(globe, props), [baseUrl])
  const { node, ifLayerReady, setVisible, } = useLayerBind<SspTileLayer>(factory, visible)

  useEffect(() => {
    ifLayerReady(layer => {
      layer.setAreaFilters(filters)
    })
  }, [filters, ifLayerReady])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.outline = outline
      layer.globe.requestRefresh()
    })
  }, [ifLayerReady, outline])

  useEffect(() => {
    ifLayerReady(layer => {
      layer.setParams(colorParams)
    })
  }, [colorParams, ifLayerReady])

  useEffect(() => {
    setVisible(visible)
  }, [setVisible, visible])

  return node
})
setDisplayName({ SspTileLayer$ })
export { SspTileLayer$ }
