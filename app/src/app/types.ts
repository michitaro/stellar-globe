import { Globe } from "@stellar-globe/stellar-globe"
import { CSSProperties } from "react"
import { AppState } from "./store"
import { AppStateWithComputed } from "./store/computedState"
export type { AppState }

export type AppProps = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
  floatingLayerElement?: HTMLElement
  floatingLayerZIndex?: CSSProperties['zIndex']
  activeOnInit?: boolean
  storageKey?: string
  onStoreChange?: (e: StoreChangeEvent) => void
  initialState?: AppState
}

export type StoreChangeEvent = {
  state: AppStateWithComputed
}

export type AppHandle = {
  globe: () => Globe
  dispatchAction: (action: { type: string, payload: unknown }) => void
  getState: () => AppStateWithComputed,
  activate: () => void
  deactivate: () => void
}
