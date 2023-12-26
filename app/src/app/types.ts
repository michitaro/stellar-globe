import { Globe } from "@stellar-globe/stellar-globe"

export type AppProps = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
}

export type AppHandle = {
  globe: () => Globe
  dispatchAction: (action: { type: string, payload: unknown }) => void
}
