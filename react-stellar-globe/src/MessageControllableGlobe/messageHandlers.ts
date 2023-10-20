import { LayerDef, MessageControllableGlobeContextType } from "./MessageControlledGlobe"

function clear({ setLayerDefs }: MessageControllableGlobeContextType) {
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

export type Message = {
  [K in MessageTypes]: {
    type: K
    args: Parameters<(typeof messageHandlers)[K]>[1]
  }
}[MessageTypes]
