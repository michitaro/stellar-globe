import { ReactWidget } from '@jupyterlab/ui-components'
import { CallbackMessage, MessageControllableGlobe, MessageControllableGlobeHandle } from './MessageControllableGlobe'
import React, { useEffect, useRef } from 'react'
import { MainAreaWidget } from '@jupyterlab/apputils'
import { Widget } from '@lumino/widgets'
import { MessageToStellarGlobe } from './MessageControllableGlobe/messageHandlers'


type PostMessageType = MessageControllableGlobeHandle["postMessage"]


type StellarGlobeWindowOptions = {
  id: string
  title?: string
  onCallback: (msg: CallbackMessage) => void
}


export class StellarGlobeWindow {
  constructor({
    id,
    title,
    onCallback,
  }: StellarGlobeWindowOptions) {
    const buf = messageBuffer()
    this._postMessage = buf.store
    const content: Widget = stellarGlobeWidget({
      onCallback,
      onInit: ({ postMessage }) => {
        buf.flush(postMessage)
        this._postMessage = postMessage
      }
    })
    const widget = new MainAreaWidget({ content })
    widget.id = id
    widget.title.label = title ?? `StellarGlobe(${id})`
    widget.title.closable = true
    this.widget = widget
  }

  readonly widget: Widget
  private _postMessage: PostMessageType

  get postMessage() {
    return this._postMessage
  }
}


function messageBuffer() {
  const buffer: MessageToStellarGlobe[] = []
  const store = (msg: MessageToStellarGlobe) => {
    buffer.push(msg)
  }
  const flush = (postMessage: PostMessageType) => {
    while (buffer.length > 0) {
      postMessage(buffer.shift()!)
    }
  }
  return { flush, store }
}


type StellarGlobeWidgetOnInit = {
  postMessage: PostMessageType
}


function stellarGlobeWidget(
  options: {
    onInit: (args: StellarGlobeWidgetOnInit) => void
    onCallback: (msg: CallbackMessage) => void
  }
) {
  const Bridge = () => {
    const handle = useRef<MessageControllableGlobeHandle>(null)
    useEffect(() => {
      options.onInit({ postMessage: handle.current!.postMessage })
    }, [])
    return <MessageControllableGlobe onCallback={options.onCallback} ref={handle} />
  }
  return ReactWidget.create(<Bridge />)
}
