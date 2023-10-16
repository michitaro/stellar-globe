import { Globe, Layer } from '@stellar-globe/stellar-globe'
import { ReactNode, createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef } from "react"


type LayerKey = unknown


function useLayerKey() {
  const keyRef = useRef({})
  return keyRef.current
}


type GlobeState = {
  globe: Globe | undefined
  layerFactories: Map<LayerKey, { factory: (globe: Globe) => Layer, el: HTMLDivElement, visible: boolean }>
  layers: Map<LayerKey, { layer: Layer, el: HTMLDivElement }>
}


type GlobeOptions = ConstructorParameters<typeof Globe>[1]
type GlobeHooks = {
  onInit?: (globe: Globe) => void
  onRelease?: (globe: Globe) => void
}


function useGenerateContext({
  onInit,
  onRelease,
  ..._globeOptions
}: GlobeOptions & GlobeHooks) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const globeOptions = useMemo(() => _globeOptions, [...Object.keys(_globeOptions), ...Object.values(_globeOptions)])
  const containerRef = useRef<HTMLDivElement>(null)
  const state = useRef<GlobeState>(useMemo(() => ({
    globe: undefined,
    layers: new Map(),
    layerFactories: new Map(),
  }), [])).current
  const { layers, layerFactories } = state

  const registerLayer = useCallback((key: LayerKey, el: HTMLDivElement, visible: boolean, factory: (globe: Globe) => Layer) => {
    if (state.globe) {
      const layer = factory(state.globe)
      layers.set(key, { layer, el })
      if (visible) {
        state.globe.addLayer(layer)
      }
    }
    else {
      layerFactories.set(key, { factory, el, visible })
    }
  }, [layerFactories, layers, state])

  const domBasedSortFunc = useCallback((a: Layer, b: Layer) => {
    const inverse = new Map<Layer, HTMLDivElement>()
    for (const [, { el, layer }] of layers) {
      inverse.set(layer, el)
    }
    return compareDomPosition(inverse.get(a), inverse.get(b))
  }, [layers])

  useEffect(function initGlobe() {
    const globe = new Globe(containerRef.current!, globeOptions)
    onInit?.(globe)
    globe.layerSorter.setSortFunc(domBasedSortFunc)
    state.globe = globe
    for (const [key, { factory, el, visible }] of layerFactories) {
      registerLayer(key, el, visible, factory)
    }
    layerFactories.clear()
    return () => {
      for (const [, { layer }] of Array.from(layers).reverse()) {
        layer.release()
      }
      layers.clear()
      onRelease?.(globe)
      globe.release()
      if (layerFactories.size > 0) {
        console.error(layerFactories)
        throw new Error(`layerFactories is not empty`)
      }
      state.globe = undefined
    }
  }, [domBasedSortFunc, globeOptions, layerFactories, layers, onInit, onRelease, registerLayer, state])

  return useMemo(() => ({
    state,
    containerRef,
    registerLayer,
  }), [registerLayer, state])
}


const GlobeContext = createContext<ReturnType<typeof useGenerateContext> | undefined>(undefined)
setDisplayName({ GlobeContext })


export type GlobeHandle = () => Globe


type GlobeProps = GlobeOptions & GlobeHooks & { children?: ReactNode }


export const Globe$ = forwardRef<GlobeHandle, GlobeProps>(function Globe$(
  {
    children,
    ...props
  }: GlobeProps,
  ref,
) {
  const context = useGenerateContext(props)
  const { containerRef, state: { globe } } = context

  useImperativeHandle(ref, () => () => context.state.globe!, [context.state])

  useEffect(() => {
    globe?.layerSorter.sort()
  })

  return (
    <GlobeContext.Provider value={context} >
      <div style={{ display: 'none' }}>
        {children}
      </div>
      <div ref={containerRef} style={{ height: '100%' }} />
    </GlobeContext.Provider>
  )
})
setDisplayName({ Globe$ })


function useGlobeContext() {
  const context = useContext(GlobeContext)
  if (context === undefined) {
    throw new Error(`use of useGlobe outside <$Globe />`)
  }
  return context
}


export function useLayerBind<L extends Layer>(factory: (globe: Globe) => Layer, initialVisible: boolean) {
  const key = useLayerKey()
  const { state, registerLayer } = useGlobeContext()
  const { layerFactories, layers } = state
  const el = useRef<HTMLDivElement>(null)

  useEffect(
    () => {
      registerLayer(key, el.current!, initialVisible, factory)
      return () => {
        layerFactories.delete(key)
        if (layers.has(key)) {
          // Globe$とLayer$が同時にunmountされる場合、Globe$が先にunmountされる。
          // その時はGlobe$のunmountに先立って、initGlobeのcleanup内でreleaseされる。
          layers.get(key)!.layer.release()
          layers.delete(key)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      factory,
      key,
      layerFactories,
      layers,
      registerLayer,
      // initialVisible,
    ],
  )

  const visibleRef = useRef(initialVisible)
  const setVisible = useCallback((newVisible: boolean) => {
    if (newVisible === undefined) {
      console.trace()
    }
    if (visibleRef.current !== newVisible) {
      visibleRef.current = newVisible
      const ready = layers.get(key)
      if (ready) {
        const { layer } = ready
        if (newVisible) {
          layer.globe.addLayer(layer)
        }
        else {
          layer.globe.removeLayer(layer)
        }
      }
    }
  }, [key, layers])

  const ifLayerReady = useCallback((cb: (layer: L) => void) => {
    const ready = layers.get(key)
    if (ready) {
      const { layer } = ready
      cb(layer as L)
    }
  }, [key, layers])

  return {
    node: <div ref={el} />,
    ifLayerReady,
    setVisible,
  }
}


type PickKeysOf<M, T> = {
  [K in keyof M]: M[K] extends T ? K : never
}[keyof M]


export function makePureLayerComponent<
  Props extends object = object,
  VisibleKey extends PickKeysOf<Props, boolean | undefined> = PickKeysOf<Props, boolean | undefined>,
  L extends Layer = Layer,
>(
  factory: (globe: Globe, props: Props) => L,
  visibleKey: VisibleKey,
) {
  return (props: Props) => {
    const { [visibleKey]: visible = true, ...rest } = props
    const factory0 = useCallback(
      (globe: Globe) => factory(globe, props),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...Object.keys(rest), ...Object.values(rest)],
    )
    const { node, setVisible } = useLayerBind(factory0, visible as boolean)
    useEffect(() => {
      // @ts-ignore
      setVisible(visible)
    }, [setVisible, visible])
    return node
  }
}


export function setDisplayName(components: { [name: string]: { displayName?: string } | React.FC<never> }) {
  for (const k of Object.keys(components)) {
    components[k].displayName = k
  }
}


function compareDomPosition(aDom?: HTMLDivElement, bDom?: HTMLDivElement) {
  if (aDom && bDom) {
    const mask = aDom.compareDocumentPosition(bDom)
    return (mask & 2) !== 0 ? +1 : (
      (mask & 4) !== 0 ? -1 : 0
    )
  }
  const reactLayerFirst = +1 // +1: true, -1: false
  if (aDom) {
    return reactLayerFirst
  }
  if (bDom) {
    return -reactLayerFirst
  }
  return 0
}
