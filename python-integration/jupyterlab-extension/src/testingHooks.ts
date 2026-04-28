import { SkyCoord, angle } from '@stellar-globe/stellar-globe'
import { JupyterFrontEnd } from '@jupyterlab/application'
import { INotebookTracker, NotebookActions, NotebookPanel } from '@jupyterlab/notebook'
import { CommType } from './types'
import { AppHandle } from '@stellar-globe/app'
import { makeStellarGlobeWidget } from './StellarGlobeWidget'
import { makeJupyterLiteInitialState } from './jupyterLiteInitialState'

export type StellarGlobeJupyterlabTestHooks = {
  openNotebook: (path: string) => Promise<void>
  runActiveNotebook: () => Promise<void>
  runNotebook: (path: string) => Promise<void>
  openViewer: (title?: string) => Promise<string>
  jumpViewer: (id: string, raDeg: number, decDeg: number, fovDeg: number) => Promise<{ center: [number, number], fov: number }>
  viewerState: (id: string) => { center: [number, number], fov: number }
  viewerTitles: () => string[]
}

declare global {
  interface Window {
    __stellarGlobeJupyterlabTestHooks__?: StellarGlobeJupyterlabTestHooks
    __stellarGlobeAppTestHandles__?: Record<string, AppHandle>
  }
}

export function installTestingHooks(app: JupyterFrontEnd, notebooks: INotebookTracker) {
  window.__stellarGlobeJupyterlabTestHooks__ = {
    openNotebook: async path => {
      await openNotebook(app, notebooks, path)
    },
    runActiveNotebook: async () => {
      const panel = notebooks.currentWidget
      if (!panel) {
        throw new Error('Notebook is not opened.')
      }
      await runNotebook(panel)
    },
    runNotebook: async path => {
      const panel = await openNotebook(app, notebooks, path)
      await runNotebook(panel)
    },
    openViewer: async (title = 'e2e smoke') => {
      const notebook = notebooks.currentWidget
      const kernel = notebook?.sessionContext.session?.kernel
      if (!kernel) {
        throw new Error('Notebook kernel is not ready.')
      }
      const id = `e2e-${Date.now()}`
      const widget = makeStellarGlobeWidget({ app, kernel }, createTestComm(), {
        id,
        title,
        queryId: '',
        initialState: makeJupyterLiteInitialState(`@stellar-globe/jupyterlab/test/${id}`),
        extraOptions: { storage: { type: 'file' } },
      })
      app.shell.activateById(widget.id)
      await waitFor(() => lookupAppHandle(id) !== undefined)
      return id
    },
    jumpViewer: async (id, raDeg, decDeg, fovDeg) => {
      const appHandle = nonNullAppHandle(id)
      appHandle.globe().camera.jumpTo(
        { fovy: angle.deg2rad(fovDeg) },
        { coord: SkyCoord.fromDeg(raDeg, decDeg), duration: 0 }
      )
      await waitFor(() => {
        const state = appHandle.getState()
        return isClose(angle.rad2deg(state.computed.center[0]), raDeg) &&
          isClose(angle.rad2deg(state.computed.center[1]), decDeg) &&
          isClose(angle.rad2deg(state.camera.params.fovy), fovDeg)
      }, 10000)
      return readViewerState(id)
    },
    viewerState: id => readViewerState(id),
    viewerTitles: () => Array.from(app.shell.widgets('main')).map(widget => widget.title.label),
  }
}

async function openNotebook(app: JupyterFrontEnd, notebooks: INotebookTracker, path: string) {
  await app.restored
  await app.commands.execute('docmanager:open', {
    path,
    factory: 'Notebook',
  })
  await waitFor(() => notebooks.currentWidget?.context.path === path)
  const panel = notebooks.currentWidget
  if (!panel) {
    throw new Error(`Notebook is not available: ${path}`)
  }
  await waitForNotebookReady(panel)
  app.shell.activateById(panel.id)
  return panel
}

async function runNotebook(panel: NotebookPanel) {
  await waitForNotebookReady(panel)
  panel.content.activeCellIndex = 0
  const result = await NotebookActions.runAll(panel.content, panel.sessionContext)
  if (result === false) {
    throw new Error('Failed to run notebook cells.')
  }
  await waitFor(() => panel.sessionContext.session?.kernel?.status === 'idle', 120000)
}

async function waitForNotebookReady(panel: NotebookPanel) {
  await panel.revealed
  await panel.context.ready
  await panel.sessionContext.ready
  await waitFor(() => panel.sessionContext.session?.kernel?.status === 'idle', 120000)
}

async function waitFor(cb: () => boolean, timeoutMs = 30000) {
  const startedAt = Date.now()
  while (!cb()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timeout after ${timeoutMs}ms.`)
    }
    await sleep(100)
  }
}

async function sleep(ms: number) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function createTestComm() {
  return {
    send() { },
    close() { },
    dispose() { },
    onMsg: undefined,
  } as unknown as CommType
}

function readViewerState(id: string) {
  const state = nonNullAppHandle(id).getState()
  return {
    center: [
      angle.rad2deg(state.computed.center[0]),
      angle.rad2deg(state.computed.center[1]),
    ] as [number, number],
    fov: angle.rad2deg(state.camera.params.fovy),
  }
}

function lookupAppHandle(id: string) {
  return window.__stellarGlobeAppTestHandles__?.[id]
}

function nonNullAppHandle(id: string): AppHandle {
  const appHandle = lookupAppHandle(id)
  if (!appHandle) {
    throw new Error(`Viewer is not available: ${id}`)
  }
  return appHandle
}

function isClose(actual: number, expected: number) {
  return Math.abs(actual - expected) < 0.1
}
