import { CloseMessage, ConnectionParams, DispatchMessage, ReopenMessage } from "./StellarGlobeWidget"

export type JsonSchema = {
  ConnectionParams: ConnectionParams
  CloseMessage: CloseMessage
  ReopenMessage: ReopenMessage
  DispatchMessage: DispatchMessage
}
