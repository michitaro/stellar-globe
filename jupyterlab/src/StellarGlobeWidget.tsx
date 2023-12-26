import { ReactWidget } from '@jupyterlab/ui-components'
import { Widget } from '@lumino/widgets'
import StellarGlobeApp, { AppHandle } from '@stellar-globe/app'
import React, { useRef } from 'react'
import { createIs } from './typeGuard'
import { CommType, StellarGlobeSessionEnv } from "./types"
import { uid } from './uid'


export type ConnectionParams = {
  layout?: | 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
}

export function stellarGlobeConnection(
  env: StellarGlobeSessionEnv,
  comm: CommType,
  {
    layout = 'split-right'
  }: ConnectionParams,
) {
  const widget = StellarGlobeAppWidget(env, comm)
  widget.id = `StellarGlobe-${uid()}`
  widget.title.label = `StellarGlobe`
  widget.title.closable = true
  env.app.shell.add(widget, 'main', { mode: layout, activate: false })
  return {
    close: () => {
      comm.close()
      comm.dispose()
    },
  }
}


function StellarGlobeAppWidget(env: StellarGlobeSessionEnv, comm: CommType) {
  const WrappedStellarGlobeApp = () => {
    const appRef = useRef<AppHandle>(null!)

    const dispatch = (msg: DispatchMessage) => {
      appRef.current.safeDispatch(msg.action)
    }

    useInit(() => {
      comm.onMsg = (e) => {
        const msg = e.content.data
        if (isCloseMessage(msg)) {
          widget.close()
        }
        else if (isReopenMessage(msg)) {
        }
        else if (isDispatchMessage(msg)) {
          dispatch(msg)
        }
        else {
          alert(`Unknown message: ${JSON.stringify(msg, null, 2)}`)
        }
      }
    })

    return (
      <StellarGlobeApp
        ref={appRef}
        catchAllKeyboardEvents={false}
        hashSync={false}
        storageSync={false}
      />
    )
  }

  const widget: Widget = ReactWidget.create(
    <WrappedStellarGlobeApp />
  )

  return widget
}


export type CloseMessage = {
  type: 'close'
}

export type ReopenMessage = {
  type: 'reopen'
}

export type DispatchMessage = {
  type: 'dispatch'
  action: {
    type: string
    payload: any
  }
}


const isCloseMessage = createIs<CloseMessage>('CloseMessage')
const isReopenMessage = createIs<ReopenMessage>('ReopenMessage')
const isDispatchMessage = createIs<DispatchMessage>('DispatchMessage')


function useInit(cb: () => void) {
  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    cb()
  }
}
