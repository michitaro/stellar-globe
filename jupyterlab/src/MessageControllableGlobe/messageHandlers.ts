import { LayerDef, MessageControllableGlobeContextType } from "."

function clear({ setLayerDefs }: MessageControllableGlobeContextType, args: undefined) {
  setLayerDefs([])
}

function setState({ setLayerDefs }: MessageControllableGlobeContextType, args: { layerDefs: LayerDef[] }) {
  setLayerDefs(args.layerDefs)
}

export const messageHandlers = {
  clear,
  setState,
}

type MessageTypes = keyof typeof messageHandlers

export type MessageToStellarGlobe = {
  [K in MessageTypes]: {
    type: K
    args: Parameters<(typeof messageHandlers)[K]>[1]
  }
}[MessageTypes]
