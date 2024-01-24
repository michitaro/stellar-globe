import { Globe } from "@stellar-globe/stellar-globe"
import { CSSProperties } from "react"
import { JsonPatchOp } from "../common/utils/generateJsonPatch"

export type AppProps = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
  floatingLayerElement?: HTMLElement
  floatingLayerZIndex?: CSSProperties['zIndex']
  activeOnInit?: boolean
  storageKey?: string
  onStoreChange?: (e: StoreChangeEvent) => void
  initialState?: unknown
}

export type StoreChangeEvent = {
  diff: JsonPatchOp[]
}

export type AppHandle = {
  globe: () => Globe
  dispatchAction: (action: { type: string, payload: unknown }) => void
  activate: () => void
  deactivate: () => void
  getState: () => unknown,
}
