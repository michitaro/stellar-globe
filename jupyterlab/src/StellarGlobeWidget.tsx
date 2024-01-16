import { ReactWidget } from '@jupyterlab/ui-components'
import { Widget } from '@lumino/widgets'
import StellarGlobeApp, { AppHandle } from '@stellar-globe/app'
import React, { useEffect, useRef } from 'react'
import { createIs } from './typeGuard'
import { CommType, StellarGlobeSessionEnv } from "./types"
import { uid } from './uid'
import { LabShell } from '@jupyterlab/application'


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
  let appHandle: AppHandle | undefined
  const widget = StellarGlobeAppWidget(env, comm, _ => { appHandle = _ })
  widget.id = `StellarGlobe-${uid()}`
  widget.title.label = `StellarGlobe`
  widget.title.closable = true
  env.app.shell.add(widget, 'main', { mode: layout })

  const onActivate = () => {
    if (env.app.shell.currentWidget === widget) {
      appHandle?.activate()
    }
    else {
      appHandle?.deactivate()
    }
  }
  null; (env.app.shell as LabShell).currentChanged?.connect(onActivate)

  return {
    close: () => {
      comm.close()
      comm.dispose()
      null; (env.app.shell as LabShell).currentChanged?.disconnect(onActivate)
    },
  }
}


function StellarGlobeAppWidget(env: StellarGlobeSessionEnv, comm: CommType, captureAppHandle: (appHandle: AppHandle) => void) {
  const WrappedStellarGlobeApp = () => {
    const appRef = useRef<AppHandle>(null!)

    const dispatch = (msg: DispatchMessage) => {
      appRef.current.dispatchAction(msg.action)
    }

    useEffect(() => {
      captureAppHandle(appRef.current)
    }, [])

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
        floatingLayerZIndex={99}
        activeOnInit={false}
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
