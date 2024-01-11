import { Action } from "@reduxjs/toolkit"
import { GlobeHandle } from "@stellar-globe/react-stellar-globe"
import { createContext, forwardRef, useContext, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useInstanceVariable } from "../common/hooks/useInstanceVaribale"
import { AppStore, makeStore } from "./store"
import { createIs, createTypeCheckers } from "./typeGuard"
import { AppHandle } from "./types"


function useMakeContext() {
  const globeHandle = useRef<GlobeHandle>(null)
  const rootElementRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const { store, stateHistory } = useInstanceVariable(makeStore)

  return useMemo(() => ({
    rootElementRef,
    globeHandle,
    store,
    stateHistory,
    active,
    setActive,
  }), [active, stateHistory, store])
}


const AppContext = createContext<undefined | ReturnType<typeof useMakeContext>>(undefined)


export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error(`use of useMiniAppContext outside the provider`)
  }
  const { globeHandle, active, rootElementRef, stateHistory, store } = context
  return {
    globeHandle,
    rootElementRef,
    stateHistory,
    active,
    store,
  }
}


export function wrapWithAppContext<T>(Component: React.ComponentType<T>) {
  return forwardRef(function WrappedComponent(props: T, ref) {
    const context = useMakeContext()
    useImperativeHandle(ref, () => {
      const handle: AppHandle = {
        globe: () => context.globeHandle.current!(),
        dispatchAction: makeTypeSafeDispatch(context.store),
        activate: () => context.setActive(true),
        deactivate: () => context.setActive(false),
      }
      return handle
    }, [context])
    return (
      <AppContext.Provider value={context}>
        {/* @ts-ignore */}
        <Component {...props} />
      </AppContext.Provider>
    )
  })
}


export type BaseAction = {
  type: string
  payload: any
}


// @ts-ignore
const isBaseAction = createIs<BaseAction>('BaseAction')
const isValidAction = createTypeCheckers('Actions')


function makeTypeSafeDispatch(store: AppStore) {
  return (action: Action) => {
    if (isBaseAction(action)) {
      if (isValidAction(action.type, action)) {
        store.dispatch(action)
      }
      else {
        alert(`Invalid Action: ${JSON.stringify(isValidAction.errors, null, 2)}`)
      }
    }
    else {
      alert(`Invalid Action: ${JSON.stringify(isBaseAction.errors, null, 2)}`)
    }
  }
}


export function useAppGetState() {
  const { store } = useAppContext()
  return () => store.getState()
}
