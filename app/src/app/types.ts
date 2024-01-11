import { Globe } from "@stellar-globe/stellar-globe"
import { CSSProperties } from "react"

export type AppProps = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
  floatingLayerElement?: HTMLElement
  floatingLayerZIndex?: CSSProperties['zIndex']
}

export type AppHandle = {
  globe: () => Globe
  dispatchAction: (action: { type: string, payload: unknown }) => void
  activate: () => void
  deactivate: () => void
}
