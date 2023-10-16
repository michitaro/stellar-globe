import { CoreContextType, CoreToWrapperMessageMap, LayerDef } from "."


function connect({ portRef }: CoreContextType, args: { port: MessagePort; id: number }) {
  console.log('Connected')
  const { id, port } = args
  const msg: CoreToWrapperMessageMap['connected'] = { type: 'connected', connected: { id } }
  portRef.current = port
  portRef.current.postMessage(msg)
}

function clear({ setLayerDefs }: CoreContextType) {
  setLayerDefs([])
}

function setState({ setLayerDefs }: CoreContextType, args: { layerDefs: LayerDef[] }) {
  setLayerDefs(args.layerDefs)
}

export const messageHandlers = {
  connect,
  clear,
  setState,
}

type MessageTypes = keyof typeof messageHandlers

export type WrapperToCoreMessage = {
  [K in MessageTypes]: {
    type: K
    args: Parameters<(typeof messageHandlers)[K]>[1]
  }
}[MessageTypes]
