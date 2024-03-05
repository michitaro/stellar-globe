import { LabShell } from '@jupyterlab/application'
import { showErrorMessage } from '@jupyterlab/apputils'
import { ContentsManager } from '@jupyterlab/services'
import { ReactWidget } from '@jupyterlab/ui-components'
import { Message } from '@lumino/messaging'
import { Widget } from '@lumino/widgets'
import StellarGlobeApp, { AppHandle, AppState } from '@stellar-globe/app'
import { AppStateWithComputed } from '@stellar-globe/app/src/app/store/computedState'
import React, { useLayoutEffect, useRef } from 'react'
import { assert } from './assert'
import { cropCanvasToAspectRatio } from './cropCanvasToAspectRatio'
import { EventEmitter } from './eventemitter'
import { JsonPatchOp, generateJsonPatch } from './generateJsonPatch'
import { lockFrame } from './lockWindow'
import { createIs } from './typevalidator'
import { CommType, StellarGlobeSessionEnv } from "./types"
import { SkyCoord, easing } from '@stellar-globe/stellar-globe'


type StellarGlobeWidgetEnv = {
  appHandle: AppHandle
  widget: Widget
  onWidgetClose: (cb: () => void) => void
  storeChange: ReturnType<typeof EventEmitter<AppStateWithComputed>>
  revision: () => number
}


// keyはwindow.id
export const widgetEnvs = new Map<string, StellarGlobeWidgetEnv>()


export type StellarGlobeWidgetParams = {
  id: string
  title?: string
  layout?: 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
  initialState?: unknown // AppStateとしたいが、typescript-json-schemaがエラーを起こすのでunknown
  responseFile: string
}

export function makeStellarGlobeWidget(
  env: StellarGlobeSessionEnv,
  comm: CommType,
  {
    id,
    layout = 'split-right',
    title = 'StellarGlobe',
    initialState,
    responseFile,
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

  let lastState: AppState | undefined = undefined
  let revision = 1

  const Component = () => {
    const appRef = useRef<AppHandle>(null!)

    const storeChange = EventEmitter<AppStateWithComputed>({ once: false })

    useLayoutEffect(() => {
      appHandle = appRef.current
      const env: StellarGlobeWidgetEnv = {
        appHandle: appRef.current,
        widget,
        onWidgetClose: cb => { cleanup.on(cb) },
        storeChange,
        revision: () => revision,
      }
      comm.onMsg = onMsgFromPython(env)

      widgetEnvs.set(id, env)
      cleanup.on(() => {
        widgetEnvs.delete(id)
      })

      lastState = appRef.current.getState()
      typedRespondToQuery('Ready', responseFile, {
        state: lastState,
        revision,
      })
    }, [])

    type OnStoreChange = NonNullable<Parameters<typeof StellarGlobeApp>[0]['onStoreChange']>

    const onStoreChange: OnStoreChange = ({ state }) => {
      assert(lastState)
      storeChange.emit(state)
      const diff = generateJsonPatch(lastState, state)
      ++revision
      sendMsgToJupyter(comm, 'StoreChanged', { diff, revision })
      lastState = state
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
  revision,
}: StellarGlobeWidgetEnv): CommType['onMsg'] {
  return wrapTypeCheck({
    Close() {
      widget.close()
    },
    Dispatch(msg) {
      appHandle.dispatchAction(msg.action)
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
    QueryState: async ({ responseFile }) => {
      const state = appHandle.getState()
      await typedRespondToQuery('QueryStateResponse', responseFile, {
        revision: revision(),
        state,
      })
    },
    QuerySnapshot: async ({ responseFile, aspectRatio }) => {
      const globe = appHandle.globe()
      const originalCanvas = globe.gl.canvas as HTMLCanvasElement
      const url = (aspectRatio ? cropCanvasToAspectRatio(originalCanvas, aspectRatio) : originalCanvas).toDataURL()
      await respondToQuery(responseFile, url)
    },
    JumpTo({ ra, dec, fov, duration, easingFunction }) {
      const globe = appHandle.globe()
      const coord = SkyCoord.fromRad(ra, dec)
      globe.camera.jumpTo({ fovy: fov }, { coord, duration: 1000 * duration, easingFunction: easingFunction && easing[easingFunction] })
    }
  })
}


async function typedRespondToQuery<T extends keyof FrontendToPython>(type: T, relpath: string, data: Omit<FrontendToPython[T], 'type'>) {
  return await respondToQuery(relpath, JSON.stringify({ ...data, type }))
}

async function respondToQuery(relpath: string, content: string) {
  const manager = new ContentsManager()
  await manager.save(relpath, {
    type: 'file',
    format: 'text',
    content: `${content.length}\n${content}`,
  })
}


function wrapTypeCheck(cbmap: { [K in keyof PythonToFrontend]: (msg: PythonToFrontend[K]) => void }): CommType['onMsg'] {
  const typeCheckers = Object.fromEntries(Object.keys(cbmap).map(k => [k, createIs(k as any)]))
  return (e) => {
    const msg = e.content.data
    const type = msg.type as string
    // @ts-ignore
    const cb = cbmap[type]
    if (cb) {
      const is = typeCheckers[type]
      if (is(msg)) {
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
        alert(`Type Error: ${JSON.stringify(is.errors, null, 2)}`)
      }
    }
    else {
      alert(`Unknown message type: ${type}`)
    }
  }
}


function sendMsgToJupyter<Type extends keyof FrontendToPython>(comm: CommType, type: Type, obj: Omit<FrontendToPython[Type], 'type'>) {
  const msg = { ...obj, type }
  comm.send(msg)
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
  FrontendConsole: {
    level: 'log' | 'debug' | 'info' | 'warn'
    args: any[]
  }
  UpdateWidgetState: {
    title: string
  }
  LockFrame: {
    window_ids: string[]
  }
  UnlockFrame: {
    window_ids: string[]
  }
  QueryState: {
    responseFile: string
  }
  QuerySnapshot: {
    responseFile: string
    aspectRatio?: number
  }
  JumpTo: {
    ra: number // radian
    dec: number // radian
    fov?: number // radian
    duration: number // second
    easingFunction?: keyof typeof easing
  }
}>


export type FrontendToPython = AddType<{
  Ready: {
    revision: number
    state: any
  }
  Closed: {
  }
  StoreChanged: {
    revision: number
    diff: JsonPatchOp[]
  }
  QueryStateResponse: {
    state: any
    revision: number
  }
}>
