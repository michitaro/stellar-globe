import { Globe$, GlobeHandle } from "@stellar-globe/react-stellar-globe"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { CALLBACK_KEY, CallbackDef, LayerComponents, LayerNames, LayerProps } from "../interface"
import { messageHandlers } from "./messageHandlers"
import './style.scss'



export default function Core() {
  const globeRef = useRef<GlobeHandle>(null)
  const context = useGenerateCoreContext()
  const { layerDefs } = context

  return (
    <CoreContext.Provider value={context}>
      <Globe$ ref={globeRef}>
        {layerDefs.map(({ type, props, key }) =>
          <FromLayerDef type={type} props={props} key={key} />
        )}
      </Globe$>
    </CoreContext.Provider>
  )
}


function useGenerateCoreContext() {
  const [layerDefs, setLayerDefs] = useState<LayerDef[]>([])
  const portRef = useRef<MessagePort>()

  const messageHandler = (e: MessageEvent) => {
    const type = e.data.type as keyof typeof messageHandlers
    const handler = messageHandlers[type]
    // @ts-ignore
    handler?.(contextRef.current, e.data.args, e)
  }

  useEffect(() => {
    window.addEventListener('message', messageHandler)
    return () => window.removeEventListener('message', messageHandler)
  }, [])

  const context = useMemo(() => ({
    layerDefs,
    setLayerDefs,
    portRef,
  }), [layerDefs])

  const contextRef = useRef(context)
  contextRef.current = context

  return context
}


export type CoreContextType = ReturnType<typeof useGenerateCoreContext>

const CoreContext = createContext<CoreContextType | undefined>(undefined)

function useCoreContext() {
  const context = useContext(CoreContext)
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
  const C = LayerComponents[type]
  const props = useConvertedProps(_props)
  return (
    // @ts-ignore
    <C {...props} />
  )
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCallback(v: any): v is CallbackDef {
  return !!v[CALLBACK_KEY]
}


export type CallbackMessage = {
  id: number
  arg: unknown
}


function useConvertedProps(props: Record<string, unknown>) {
  const { portRef } = useCoreContext()
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
          if (!portRef.current) {
            throw new Error(`Callback port is not set`)
          }
          const msg: CoreToWrapperMessageMap['callback'] = {
            type: 'callback',
            callback: { id, arg }
          }
          portRef.current.postMessage(msg)
        }
        callbackCache.set(k, { id, cb })
        v = cb
      }
      return [k, v]
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


export type CoreToWrapperMessageMap = {
  callback: {
    type: 'callback'
    callback: {
      id: number
      arg: unknown
    }
  }
  connected: {
    type: 'connected'
    connected: { id: number }
  }
}

export type CoreToWrapperMessage = CoreToWrapperMessageMap[keyof CoreToWrapperMessageMap]
