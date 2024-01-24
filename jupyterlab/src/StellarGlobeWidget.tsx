import { LabShell } from '@jupyterlab/application'
import { showErrorMessage } from '@jupyterlab/apputils'
import { ReactWidget } from '@jupyterlab/ui-components'
import { Message } from '@lumino/messaging'
import { Widget } from '@lumino/widgets'
import StellarGlobeApp, { AppHandle } from '@stellar-globe/app'
import { JsonPatchOp } from '@stellar-globe/app/src/common/utils/generateJsonPatch'
import React, { memo, useCallback, useLayoutEffect, useRef } from 'react'
import { createIs } from './typeGuard'
import { CommType, StellarGlobeSessionEnv } from "./types"
import { uid } from './uid'


export type StellarGlobeWidgetParams = {
  title?: string
  layout?: 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
  initialState?: unknown
}

export function makeStellarGlobeWidget(
  env: StellarGlobeSessionEnv,
  comm: CommType,
  {
    layout = 'split-right',
    title = 'StellarGlobe',
    initialState,
  }: StellarGlobeWidgetParams,
) {
  const shell = env.app.shell as LabShell
  let appHandle: AppHandle | undefined

  const captureAppHandle = (_: AppHandle) => { appHandle = _ }

  const cleanup = () => {
    shell.currentChanged?.disconnect(onActivate)
    try {
      comm.send(makeMsg<FrontendToPython['Closed']>({ type: 'Closed' }))
      comm.close()
      comm.dispose()
    } catch {
    }
  }

  const widget = new class extends ReactWidget {
    protected onCloseRequest(msg: Message): void {
      cleanup()
      return super.onCloseRequest(msg)
    }

    render() {
      return (
        <StellarGlobeComponent
          comm={comm}
          captureAppHandle={captureAppHandle}
          onCloseRequestFromPython={() => widget.close()}
          initialState={initialState}
        />
      )
    }
  }

  widget.id = `StellarGlobe-${uid()}`
  widget.title.label = title
  widget.title.closable = true
  env.app.shell.add(widget, 'main', { mode: layout })

  const onActivate = () => {
    if (shell.currentWidget === widget) {
      appHandle?.activate()
    }
    else {
      appHandle?.deactivate()
    }
  }
  shell.currentChanged?.connect(onActivate)

  return widget as Widget
}



type StellarGlobeComponentProps = {
  comm: CommType
  captureAppHandle: (appHandle: AppHandle) => void
  onCloseRequestFromPython: () => void
  initialState: unknown
}


const StellarGlobeComponent = memo(({
  comm,
  captureAppHandle,
  onCloseRequestFromPython,
  initialState,
}: StellarGlobeComponentProps) => {
  const appRef = useRef<AppHandle>(null!)

  const dispatch = (msg: PythonToFrontend['Dispatch']) => {
    appRef.current.dispatchAction(msg.action)
  }

  useLayoutEffect(() => {
    comm.onMsg = (e) => {
      const msg = e.content.data
      if (isCloseMessage(msg)) {
        onCloseRequestFromPython()
      }
      else if (isDispatchMessage(msg)) {
        dispatch(msg)
      }
      else if (isShowErrorMessage(msg)) {
        showErrorMessage(msg.params.title, msg.params.body)
      }
      else {
        alert(`Unknown message: ${JSON.stringify(msg, null, 2)}`)
      }
    }
    comm.send(makeMsg<FrontendToPython['Ready']>({ type: 'Ready', state: appRef.current.getState() }))
    captureAppHandle(appRef.current)
  }, [])

  type OnStoreChange = NonNullable<Parameters<typeof StellarGlobeApp>[0]['onStoreChange']>

  const onStoreChange = useCallback<OnStoreChange>(({ diff }) => {
    comm.send(makeMsg<FrontendToPython['StoreChanged']>({
      type: 'StoreChanged',
      diff,
    }))
  }, [])

  return (
    <StellarGlobeApp
      ref={appRef}
      catchAllKeyboardEvents={false}
      hashSync={false}
      storageSync={false}
      floatingLayerZIndex={99}
      activeOnInit={false}
      storageKey='@stellar-globe/jupyterlab/store-settings'
      onStoreChange={onStoreChange}
      initialState={initialState}
    />
  )
})


function makeMsg<T>(obj: T) {
  return obj
}


type AddType<T> = {
  [K in keyof T]: T[K] & { type: K }
}


export type PythonToFrontend = AddType<{
  Close: {
  }
  Dispatch: {
    action: {
      type: string
      payload: any
    }
  }
  ShowError: {
    params: {
      title: string
      body: string
    }
  }
}>


export type FrontendToPython = AddType<{
  Ready: {
    state: any
  }
  Closed: {
  }
  StoreChanged: {
    diff: JsonPatchOp[]
  }
}>


const isCloseMessage = createIs<PythonToFrontend['Close']>('Close')
const isDispatchMessage = createIs<PythonToFrontend['Dispatch']>('Dispatch')
const isShowErrorMessage = createIs<PythonToFrontend['ShowError']>('ShowError')
