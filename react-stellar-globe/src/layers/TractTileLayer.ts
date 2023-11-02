import { Globe, TractTileLayer } from "@stellar-globe/stellar-globe"
import React, { memo, useCallback, useEffect } from "react"
import { setDisplayName, useLayerBind } from "../Globe"

type TractTileLayerProps = ConstructorParameters<typeof TractTileLayer>[1] & {
  visible?: boolean
}
const TractTileLayer$: React.FC<TractTileLayerProps> = memo(props => {
  const {
    baseUrl,
    colorParams = TractTileLayer.defaultParams('sdssTrueColor'),
    filters,
    outline = false,
    visible = true,
  } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new TractTileLayer(globe, props), [baseUrl])
  const { node, ifLayerReady, setVisible, } = useLayerBind<TractTileLayer>(factory, visible)

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
setDisplayName({ TractTileLayer$ })
export { TractTileLayer$ }
