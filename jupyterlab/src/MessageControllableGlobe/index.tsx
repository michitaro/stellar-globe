import {
  ClickableMarkerLayer$,
  ConstellationLayer$,
  EsoMilkyWayLayer$, Globe$,
  GlobeEventLayer$,
  GlobeHandle, GridLayer$,
  HipparcosCatalogLayer$,
  HipsSimpleLayer$,
  PathLayer$,
  TextLayer$,
  TractTileLayer$,
  alwaysOne
} from "@stellar-globe/react-stellar-globe"
import { Globe } from "@stellar-globe/stellar-globe"
import React, { createContext, forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TypeGuardError, assertMessageToStellarGlobeType } from "../TypeGuard"
import { messageHandlers } from "./messageHandlers"
import { debounce } from "./debounce"


export type UnvalidatedMessage = { type: string }


type MessageControllableGlobeProps = {
  onCallback: (message: CallbackMessage) => void
}

export type MessageControllableGlobeHandle = {
  postUnvalidatedMessage: (message: UnvalidatedMessage) => void
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
  const { state } = context
  const { layerDefs } = state
  useImperativeHandle(ref, () => ({
    postUnvalidatedMessage: (msg: UnvalidatedMessage) => {
      const { type } = msg
      // @ts-ignore
      const handler = messageHandlers[type]
      if (handler === undefined) {
        throw new TypeGuardError(`Unknown Message Type: ${type}`)
      }
      // @ts-ignore
      assertMessageToStellarGlobeType(type, msg)
      // @ts-ignore
      handler(context, msg.args)
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


function initialState() {
  return {
    layerDefs: [] as LayerDef[],
  }
}


export type State = ReturnType<typeof initialState>


function useGenerateCoreContext(
  onCallback: (message: CallbackMessage) => void,
  getGlobe: () => Globe | undefined,
) {
  const [state, setState] = useState(initialState)
  const context = useMemo(() => ({
    state,
    setState,
    onCallback,
    getGlobe,
  }), [getGlobe, onCallback, setState, state])
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
    // @ts-ignore
    <C {...props} />
  )
}


function isCallback(v: unknown): v is CallbackProp {
  // @ts-ignore
  return v && !!v[CALLBACK_KEY]
}


type DebouncedCallback = ReturnType<typeof debounce>


function useConvertedProps<T extends Record<string, unknown>>(props: T, runCallback: (message: CallbackMessage) => void): Record<keyof T, unknown> {
  type CallbackCache = Map<string, { id: string, cb: DebouncedCallback }>
  const callbackCache = useRef<CallbackCache>(useMemo(() => new Map(), [])).current
  useEffect(() => {
    return () => {
      callbackCache.forEach(({ cb }) => {
        cb.stop()
      })
    }
  }, [callbackCache])
  return Object.fromEntries(Object.entries(props).map(([k, v]) => {
    if (isCallback(v)) {
      const id = v[CALLBACK_KEY].id
      const cache = callbackCache.get(k)
      if ((cache && cache.id === id)) {
        v = cache.cb
      }
      else {
        const cb = debounce(v[CALLBACK_KEY].debounce ?? 0, (arg: unknown) => {
          const msg: CallbackMessage = {
            type: 'callback',
            callback: { id, arg }
          }
          runCallback(msg)
        })
        callbackCache.get(k)?.cb.stop()
        callbackCache.set(k, { id, cb })
        v = cb
      }
      return [k, v]
    }
    else {
      callbackCache.get(k)?.cb.stop()
      callbackCache.delete(k)
    }
    return [k, v]
  })) as Record<keyof T, unknown>
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
    id: string
    arg: any
  }
}


function TextLayerForJupyterLab(props: Parameters<typeof TextLayer$>[0]) {
  props.alphaFunc = alwaysOne
  return <TextLayer$ {...props} />
}


const layerComponents: {
  ConstellationLayer: typeof ConstellationLayer$,
  EsoMilkyWayLayer: typeof EsoMilkyWayLayer$,
  TractTileLayer: typeof TractTileLayer$,
  GridLayer: typeof GridLayer$,
  TextLayer: typeof TextLayer$,
  HipparcosCatalogLayer: typeof HipparcosCatalogLayer$,
  HipsSimpleLayer: typeof HipsSimpleLayer$,
  ClickableMarkerLayer: typeof ClickableMarkerLayer$,
  GlobeEventLayer: typeof GlobeEventLayer$,
  PathLayer: typeof PathLayer$,
} // these type annotations are needed to prevent TS2742
  = {
  ConstellationLayer: ConstellationLayer$,
  EsoMilkyWayLayer: EsoMilkyWayLayer$,
  TractTileLayer: TractTileLayer$,
  GridLayer: GridLayer$,
  TextLayer: TextLayerForJupyterLab,
  HipparcosCatalogLayer: HipparcosCatalogLayer$,
  HipsSimpleLayer: HipsSimpleLayer$,
  ClickableMarkerLayer: ClickableMarkerLayer$,
  GlobeEventLayer: GlobeEventLayer$,
  PathLayer: PathLayer$,
}

type LayerNames = keyof typeof layerComponents
type Props<T extends (...args: never[]) => unknown> = Parameters<T>[0]


type NativeLayerProps = {
  [K in LayerNames]: Props<(typeof layerComponents)[K]>
}

export type LayerProps = {
  [K in keyof NativeLayerProps]: {
    [P in keyof NativeLayerProps[K]]: ConvertFunctionToCallback<NativeLayerProps[K][P]>
  }
}

export type LayerCallbacks = {
  [K in keyof NativeLayerProps]: {
    [P in keyof Required<NativeLayerProps[K]>]: PickCallbackParameter0<NonNullable<NativeLayerProps[K][P]>>
  }
}


type ConvertFunctionToCallback<T> = T extends (...args: any[]) => unknown ? CallbackProp : T
type PickCallbackParameter0<T> = T extends (arg0: infer R, ...rest: any[]) => unknown ? R : never

const CALLBACK_KEY = 'stellarglobe_callback'

export type CallbackProp = {
  stellarglobe_callback: { // [CALLBACK_KEY]: としたいが typescript-jsonschema がうまく処理してくれない
    id: string
    debounce?: number
  }
}

// CALLBACK_KEY == 'stellarglobe_callback' であることを確認
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CHECK_CALLBACK_KEY = (CallbackProp extends { [CALLBACK_KEY]: {} } ? CallbackProp : {})["stellarglobe_callback"]
