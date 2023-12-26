import { Globe } from "@stellar-globe/stellar-globe"

export type AppProps = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
}

export type AppHandle = {
  globe: () => Globe
  safeDispatch: (action: { type: string, payload: unknown }) => void
}
