import { LabShell } from '@jupyterlab/application'
import { showErrorMessage } from '@jupyterlab/apputils'
import { ContentsManager } from '@jupyterlab/services'
import { ReactWidget } from '@jupyterlab/ui-components'
import { Message } from '@lumino/messaging'
import { Widget } from '@lumino/widgets'
import StellarGlobeApp, { AppHandle, AppState } from '@stellar-globe/app'
import { FromApp, StateManager, ToApp, validateAction, validateToAppMessage } from '@stellar-globe/app/commTools'
import { SkyCoord, easing } from '@stellar-globe/stellar-globe'
import React, { useLayoutEffect, useRef } from 'react'
import { cropCanvasToAspectRatio } from './cropCanvasToAspectRatio'
import { EventEmitter } from './eventemitter'
import { lockFrame } from './lockWindow'
import { CommType, StellarGlobeSessionEnv } from "./types"


type StellarGlobeWidgetEnv = {
  appHandle: AppHandle
  widget: Widget
  onWidgetClose: (cb: () => void) => void
  stateManager: () => StateManager<unknown>
}


// keyはwindow.id
export const widgetEnvs = new Map<string, StellarGlobeWidgetEnv>()


export type StellarGlobeWidgetParams = {
  id: string
  title?: string
  layout?: 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
  initialState?: unknown // AppStateとしたいが、typescript-json-schemaがエラーを起こすのでunknown
  queryId: string
}

export function makeStellarGlobeWidget(
  env: StellarGlobeSessionEnv,
  comm: CommType,
  {
    id,
    layout = 'split-right',
    title = 'StellarGlobe',
    initialState,
    queryId,
  }: StellarGlobeWidgetParams,
) {
  const shell = env.app.shell as LabShell

  let appHandle: AppHandle | undefined

  const cleanup = EventEmitter({ once: true })
  cleanup.on(() => {
    try {
      sendMsgToJupyter(comm, 'Closed', {})
      comm.close()
      comm.dispose()
    } catch {
    }
  })

  let stateManager: StateManager<unknown>

  const Component = () => {
    const appRef = useRef<AppHandle>(null!)

    useLayoutEffect(() => {
      appHandle = appRef.current
      stateManager = new StateManager(appHandle.getState())

      const env: StellarGlobeWidgetEnv = {
        appHandle: appRef.current,
        widget,
        onWidgetClose: cb => { cleanup.on(cb) },
        stateManager: () => stateManager,
      }
      comm.onMsg = onMsgFromPython(env)

      widgetEnvs.set(id, env)
      cleanup.on(() => {
        widgetEnvs.delete(id)
      })

      typedRespondToQuery('Ready', queryId, {
        revision: stateManager.revision,
        state: appRef.current.getState(),
      })
    }, [])

    type OnStoreChange = NonNullable<Parameters<typeof StellarGlobeApp>[0]['onStoreChange']>

    const onStoreChange: OnStoreChange = ({ state }) => {
      const patch = stateManager.pushState(state)
      sendMsgToJupyter(comm, 'StoreChanged', patch)
    }

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
        initialState={initialState as AppState}
      />
    )
  }

  const widget = new class extends ReactWidget {
    protected onCloseRequest(msg: Message): void {
      cleanup.emit()
      return super.onCloseRequest(msg)
    }

    render() {
      return (
        <Component />
      )
    }
  }

  widget.id = `StellarGlobe-${id}`
  widget.title.label = title
  widget.title.closable = true
  env.app.shell.add(widget, 'main', { mode: layout })

  const onActiveWidgetChange = () => {
    if (shell.currentWidget === widget) {
      appHandle?.activate()
    }
    else {
      appHandle?.deactivate()
    }
  }
  shell.currentChanged?.connect(onActiveWidgetChange)
  cleanup.on(() => {
    shell.currentChanged?.disconnect(onActiveWidgetChange)
  })

  return widget as Widget
}


function onMsgFromPython({
  appHandle,
  widget,
  stateManager,
}: StellarGlobeWidgetEnv): CommType['onMsg'] {
  return wrapTypeCheck({
    Open() { },
    Close() {
      widget.close()
    },
    Dispatch(msg) {
      const { errors } = validateAction(msg.action)
      if (errors.length === 0) {
        appHandle.dispatchAction(msg.action)
      }
      else {
        alert(`Type Error: ${JSON.stringify(errors, null, 2)}`)
      }
    },
    ShowError(msg) {
      showErrorMessage(msg.params.title, msg.params.body)
    },
    UpdateWidgetState(msg) {
      widget.title.label = msg.title
    },
    FrontendConsole(msg) {
      console[msg.level](...msg.args)
    },
    LockFrame(msg) {
      lockFrame(msg.window_ids)
    },
    UnlockFrame(msg) {
      lockFrame.unlock(msg.window_ids)
    },
    QueryState: async ({ queryId, baseRevision }) => {
      const batchPatch = stateManager().patchFrom(baseRevision)
      await typedRespondToQuery('QueryStateResponse', queryId, batchPatch)
    },
    QuerySnapshot: async ({ queryId, aspectRatio }) => {
      const globe = appHandle.globe()
      const originalCanvas = globe.gl.canvas as HTMLCanvasElement
      const url = (aspectRatio ? cropCanvasToAspectRatio(originalCanvas, aspectRatio) : originalCanvas).toDataURL()
      await respondToQuery(queryId, url)
    },
    JumpTo({ ra, dec, fov, duration, easingFunction }) {
      const globe = appHandle.globe()
      const coord = SkyCoord.fromRad(ra, dec)
      globe.camera.jumpTo({ fovy: fov }, { coord, duration: 1000 * duration, easingFunction: easingFunction && easing[easingFunction] })
    }
  })
}


async function typedRespondToQuery<T extends keyof FromApp>(type: T, relpath: string, data: Omit<FromApp[T], 'type'>) {
  return await respondToQuery(relpath, JSON.stringify({ ...data, type }))
}

async function respondToQuery(relpath: string, content: string) {
  const manager = new ContentsManager()
  await manager.save(`~query-${relpath}`, {
    type: 'file',
    format: 'text',
    content: `${content.length}\n${content}`,
  })
}



function wrapTypeCheck(cbmap: { [K in keyof ToApp]: (msg: ToApp[K]) => void }): CommType['onMsg'] {

  const typeCheckers = Object.fromEntries(Object.keys(cbmap).map(k => [
    k,
    (msg: any) => {
      const { errors } = validateToAppMessage(k as any, msg)
      return errors.length === 0
    },
  ]))

  return (e) => {
    const msg = e.content.data
    const type = msg.type as string
    // @ts-ignore
    const cb = cbmap[type]
    if (cb) {
      const isValidMsg = typeCheckers[type]
      if (isValidMsg(msg)) {
        try {
          const result = cb(msg)
          if (result instanceof Promise) {
            result.catch(e => {
              alert(e)
            })
          }
        }
        catch (e) {
          alert(e)
        }
      }
      else {
        alert(`Type Error: ${JSON.stringify(validateToAppMessage(type as any, msg).errors, null, 2)}`)
      }
    }
    else {
      alert(`Unknown message type: ${type}`)
    }
  }
}


function sendMsgToJupyter<Type extends keyof FromApp>(comm: CommType, type: Type, obj: Omit<FromApp[Type], 'type'>) {
  const msg = { ...obj, type }
  comm.send(msg)
}
