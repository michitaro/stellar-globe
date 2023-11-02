import { MainAreaWidget } from '@jupyterlab/apputils'
import { ReactWidget } from '@jupyterlab/ui-components'
import { Widget } from '@lumino/widgets'
import React, { useEffect, useRef } from 'react'
import { CallbackMessage, MessageControllableGlobe, MessageControllableGlobeHandle, UnvalidatedMessage } from './MessageControllableGlobe'


type PostUnvalidatedMessageType = (msg: UnvalidatedMessage) => void


type StellarGlobeWindowOptions = {
  id: string
  title?: string
  onCallback: (msg: CallbackMessage) => void
  onDisposed: () => void
}


export class StellarGlobeWindow {
  constructor({
    id,
    title,
    onDisposed,
    onCallback,
  }: StellarGlobeWindowOptions) {
    const buf = messageBuffer()
    this._postUnvalidatedMessage = buf.store
    const content: Widget = stellarGlobeWidget({
      onCallback,
      onInit: ({ postUnvalidatedMessage }) => {
        buf.flush(postUnvalidatedMessage)
        this._postUnvalidatedMessage = postUnvalidatedMessage
      },
    })
    const widget = new MainAreaWidget({ content })
    widget.id = id
    widget.title.label = title ?? `StellarGlobe(${id})`
    widget.title.closable = true
    widget.disposed.connect(() => {
      onDisposed()
    })
    this.widget = widget
  }

  get id() {
    return this.widget.id
  }

  readonly widget: Widget
  private _postUnvalidatedMessage: PostUnvalidatedMessageType

  get postUnvalidatedMessage() {
    return this._postUnvalidatedMessage
  }

  close() {
    this.widget.close()
    this.widget.dispose()
  }
}


function messageBuffer() {
  const buffer: UnvalidatedMessage[] = []
  const store: PostUnvalidatedMessageType = msg => {
    buffer.push(msg)
  }
  const flush = (postUnvalidatedMessage: PostUnvalidatedMessageType) => {
    while (buffer.length > 0) {
      postUnvalidatedMessage(buffer.shift()!)
    }
  }
  return { flush, store }
}


type StellarGlobeWidgetOnInit = {
  postUnvalidatedMessage: PostUnvalidatedMessageType
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
      options.onInit({ postUnvalidatedMessage: handle.current!.postUnvalidatedMessage })
    }, [])
    return <MessageControllableGlobe onCallback={options.onCallback} ref={handle} />
  }
  return ReactWidget.create(<Bridge />)
}
