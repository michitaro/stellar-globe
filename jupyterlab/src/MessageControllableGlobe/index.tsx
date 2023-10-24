import {
  ClickableMarkerLayer$,
  ConstellationLayer$,
  EsoMilkyWayLayer$, Globe$, GlobeHandle, GridLayer$,
  HipparcosCatalogLayer$,
  HipsSimpleLayer$,
  SspTileLayer$,
  TextLayer$
} from "@stellar-globe/react-stellar-globe"
import { Globe } from "@stellar-globe/stellar-globe"
import React, { createContext, forwardRef, memo, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { MessageToStellarGlobe, messageHandlers } from "./messageHandlers"


type MessageControllableGlobeProps = {
  onCallback: (message: CallbackMessage) => void
}

export type MessageControllableGlobeHandle = {
  postMessage: (message: MessageToStellarGlobe) => void
}

export const MessageControllableGlobe = memo(forwardRef<MessageControllableGlobeHandle, MessageControllableGlobeProps>((
  { onCallback },
  ref,
) => {
  const globeRef = useRef<GlobeHandle>(null)
  const getGlobe = useCallback(() => {
    if (!globeRef.current) {
      throw new Error(`use of getGlobe in render phase`)
    }
    return globeRef.current()
  }, [])
  const context = useGenerateCoreContext(onCallback, getGlobe)
  const { layerDefs } = context
  useImperativeHandle(ref, () => ({
    postMessage: (msg: MessageToStellarGlobe) => {
      const { type } = msg
      const handler = messageHandlers[type]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handler?.(context, msg.args)
    }
  }), [context])
  return (
    <Context.Provider value={context}>
      <Globe$ ref={globeRef}>
        {layerDefs.map(({ type, props, key }) =>
          <FromLayerDef type={type} props={props} key={key} />
        )}
      </Globe$>
    </Context.Provider>
  )
}))


function useGenerateCoreContext(
  onCallback: (message: CallbackMessage) => void,
  getGlobe: () => Globe | undefined,
) {
  const [layerDefs, setLayerDefs] = useState<LayerDef[]>([])
  const context = useMemo(() => ({
    layerDefs,
    setLayerDefs,
    onCallback,
    getGlobe,
  }), [getGlobe, layerDefs, onCallback])
  return context
}


export type MessageControllableGlobeContextType = ReturnType<typeof useGenerateCoreContext>
const Context = createContext<MessageControllableGlobeContextType | undefined>(undefined)

function useCoreContext() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`use of useCoreContext outside CoreContext.Provider`)
  }
  return context
}


const FromLayerDef = <K extends keyof LayerProps>({
  type,
  props: _props,
}: {
  type: K,
  props: LayerProps[K],
}) => {
  const { onCallback: onFireCallback } = useCoreContext()
  const C = layerComponents[type]
  const props = useConvertedProps(_props, onFireCallback)
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <C {...props} />
  )
}


function isCallback(v: unknown): v is CallbackDef {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return v && !!v[CALLBACK_KEY]
}


function useConvertedProps(props: Record<string, unknown>, runCallback: (message: CallbackMessage) => void) {
  const callbackCache = useRef<
    Map<string, { id: number, cb: (...args: unknown[]) => void }>
  >(useMemo(() => new Map(), [])).current
  return Object.fromEntries(Object.entries(props).map(([k, v]) => {
    if (isCallback(v)) {
      const id = v[CALLBACK_KEY].id
      const cache = callbackCache.get(k)
      if ((cache && cache.id === id)) {
        v = cache.cb
      }
      else {
        const cb = (arg: unknown) => {
          const msg: CallbackMessage = {
            type: 'callback',
            callback: { id, arg }
          }
          runCallback(msg)
        }
        callbackCache.set(k, { id, cb })
        v = cb
      }
      return [k, v]
    }
    else {
      callbackCache.delete(k)
    }
    return [k, v]
  }))
}


function layerDef<K extends LayerNames>(type: K, props: LayerProps[K], key: string) {
  return { type, props, key }
}


export type LayerDef = {
  [K in LayerNames]:
  ReturnType<typeof layerDef<K>>
}[LayerNames]


export type CallbackMessage = {
  type: 'callback'
  callback: {
    id: number
    arg: unknown
  }
}


export function callbackDef(id: number) {
  return {
    [CALLBACK_KEY]: {
      id
    }
  }
}

const layerComponents: {
  ConstellationLayer: typeof ConstellationLayer$,
  EsoMilkyWayLayer: typeof EsoMilkyWayLayer$,
  SspTileLayer: typeof SspTileLayer$,
  GridLayer: typeof GridLayer$,
  TextLayer: typeof TextLayer$,
  HipparcosCatalogLayer: typeof HipparcosCatalogLayer$,
  HipsSimpleLayer: typeof HipsSimpleLayer$,
  ClickableMarkerLayer: typeof ClickableMarkerLayer$,
} // these type annotations are needed to prevent TS2742
  = {
  ConstellationLayer: ConstellationLayer$,
  EsoMilkyWayLayer: EsoMilkyWayLayer$,
  SspTileLayer: SspTileLayer$,
  GridLayer: GridLayer$,
  TextLayer: TextLayer$,
  HipparcosCatalogLayer: HipparcosCatalogLayer$,
  HipsSimpleLayer: HipsSimpleLayer$,
  ClickableMarkerLayer: ClickableMarkerLayer$,
}

type LayerNames = keyof typeof layerComponents
type Props<T extends (...args: never[]) => unknown> = Parameters<T>[0]


type NativeLayerProps = {
  [K in LayerNames]: Props<(typeof layerComponents)[K]>
}

type LayerProps = {
  [K in keyof NativeLayerProps]: {
    [P in keyof NativeLayerProps[K]]: ConvertFunctionToCallback<NativeLayerProps[K][P]>
  }
}

const CALLBACK_KEY = 'stellarglobe_callback'

type CallbackDef = {
  [CALLBACK_KEY]: {
    id: number
  }
}

type ConvertFunctionToCallback<T> = T extends undefined ? undefined : (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => unknown ?
  CallbackDef : T
)


export type LayerPropsForJsonSchema =  LayerProps
