import { DockLayout } from '@lumino/widgets'
import { CallbackMessage, CallbackProp, LayerCallbacks, LayerProps } from './MessageControllableGlobe'
import { MessageToStellarGlobeMap } from './MessageControllableGlobe/messageHandlers'


export type JsonSchema = {
  MessageToJS: {
    openWindow: {
      type: 'openWindow'
      args: {
        id: string
        title?: string
        layout?: DockLayout.InsertMode
      }
    }
    closeWindow: {
      type: 'closeWindow',
      args: {},
    }
    setWindowState: {
      type: 'setWindowState',
      args: {
        title?: string
      }
    }
    showErrorMessage: {
      type: 'showErrorMessage'
      args: {
        title: string
        body: string
      }
    }
    CallbackProp: CallbackProp
  } & MessageToStellarGlobeMap
  MessageToPython: {
    windowClosed: {
      type: 'windowClosed'
      args: {}
    }
    callback: CallbackMessage
  }
  LayerProps: LayerProps
  LayerCallbacks: LayerCallbacks
}
