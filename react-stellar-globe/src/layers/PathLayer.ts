import { Globe, PathLayer as CorePathLayer } from '@stellar-globe/stellar-globe'
import { memo, useCallback, useEffect } from 'react'
import { useLayerBind } from '..'
import { setDisplayName } from '../GlobeContext'


type PathLayerProps = ConstructorParameters<typeof CorePathLayer>[1] & {
  visible?: boolean
}

const PathLayer: React.FC<PathLayerProps> = memo(props => {
  const { visible = true, ...options } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factory = useCallback((globe: Globe) => new CorePathLayer(globe, options), [])
  const { node, ifLayerReady } = useLayerBind<CorePathLayer>(factory, visible)
  const { paths, blendMode, dimOnZoom, darkenNarrowLine } = options

  useEffect(() => {
    ifLayerReady(layer => {
      layer.paths = paths
    })
  }, [ifLayerReady, paths])

  useEffect(() => {
    ifLayerReady(layer => {
      const defaults = CorePathLayer.defaultOptions()
      layer.blendeMode = blendMode ?? defaults.blendMode
      layer.dimOnZoom = dimOnZoom ?? defaults.dimOnZoom
      layer.darkenNarrowLine = darkenNarrowLine ?? defaults.darkenNarrowLine
    })
  }, [blendMode, darkenNarrowLine, dimOnZoom, ifLayerReady])

  return node
})

setDisplayName({ PathLayer })
export { PathLayer }

/** @deprecated Use PathLayer instead */
export const PathLayer$ = PathLayer
