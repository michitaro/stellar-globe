import { DialogContextHandle } from "@stellar-globe/react-draggable-dialog"
import { GlobeHandle } from "@stellar-globe/react-stellar-globe"
import { ForwardedRef, ReactNode, createContext, useContext, useImperativeHandle, useMemo, useRef, useState } from "react"
import { AppHandle } from "."
import { useInstanceVariable } from "../common/hooks/useInstanceVaribale"
import { StoreChangeEvent, makeStore } from "./store"
import { stateWithComputed } from "./store/computedState"


type Params = {
  active: boolean
  storageKey: string
  onStoreChange?: (e: StoreChangeEvent) => void
  initialState?: unknown
}


export function useMakeContext(params: Params) {
  const { storageKey, onStoreChange } = params
  const globeHandle = useRef<GlobeHandle>(null)
  const rootElementRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(params.active)
  const { store, stateHistory } = useInstanceVariable(() => makeStore({ storageKey, onStoreChange, initialState: params.initialState }))
  const dialogContext = useRef<DialogContextHandle>(null)

  return useMemo(() => ({
    rootElementRef,
    globeHandle,
    store,
    stateHistory,
    active,
    setActive,
    dialogContext,
  }), [active, stateHistory, store])
}


type AppContextType = ReturnType<typeof useMakeContext>
const AppContext = createContext<undefined | AppContextType>(undefined)


export function AppContextProvider({ children, context }: { children: ReactNode, context: AppContextType }) {
  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  )
}


export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error(`use of useMiniAppContext outside the provider`)
  }
  const { globeHandle, active, rootElementRef, stateHistory, store, dialogContext } = context
  return {
    globeHandle,
    rootElementRef,
    stateHistory,
    active,
    store,
    dialogContext,
  }
}


export function useSetupAppHandle(ref: ForwardedRef<AppHandle>, context: AppContextType) {
  useImperativeHandle(ref, () => ({
    globe: () => context.globeHandle.current!(),
    dispatchAction: action => context.store.dispatch(action), //  makeTypeSafeDispatch(context.store),
    activate: () => context.setActive(true),
    deactivate: () => context.setActive(false),
    getState: () => stateWithComputed(context.store.getState()),
  }), [context])
}


export type BaseAction = {
  type: string
  payload: any
}


export function useAppGetState() {
  const { store } = useAppContext()
  return () => store.getState()
}
