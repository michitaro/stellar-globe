import { LayerProps } from "./MessageControllableGlobe"
import { MessageToStellarGlobe, messageHandlers } from "./MessageControllableGlobe/messageHandlers"
import { OpenWindowMessage } from "./TypeGuard"


export type JsonSchema = {
  MessageToStellarGlobe: MessageToStellarGlobe
  MessageToJupyterLabMap: {
    OpenWindowMessage: OpenWindowMessage
  }
  MessageToStellarGlobeMap: {
    [K in keyof typeof messageHandlers]: Parameters<(typeof messageHandlers)[K]>[1]
  }
  LayerPropsMap: LayerProps
}
