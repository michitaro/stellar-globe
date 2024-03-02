// ここで export しているものは ./src/export.ts で型が矛盾していないかチェックする
import { Globe } from "@stellar-globe/stellar-globe"
import { CSSProperties, FC } from "react"
import { configureStore } from '@reduxjs/toolkit'

declare const App: FC<AppProps & { ref: unknown }>
export default App

export function makeStore(args: {
    storageKey: string
    onStoreChange?: (e: StoreChangeEvent) => void
    initialState?: unknown
}): {
    store: ReturnType<typeof configureStore>
    stateHistory: unknown
}

type AppState = any
type AppStateWithComputed = any

type AppProps = {
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

type StoreChangeEvent = {
    state: AppStateWithComputed
}

type AppHandle = {
    globe: () => Globe
    dispatchAction: (action: { type: string, payload: unknown }) => void
    getState: () => AppStateWithComputed,
    activate: () => void
    deactivate: () => void
}

export type { AppHandle, AppState }
