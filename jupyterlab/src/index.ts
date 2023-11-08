import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { ISessionContext, showErrorMessage } from '@jupyterlab/apputils'
import { INotebookTracker } from '@jupyterlab/notebook'
import { UnvalidatedMessage } from './MessageControllableGlobe'
import { StellarGlobeWindow } from './StellarGlobeWindow'
import { TypeGuardError, assertMessageToStellarGlobeType, catchTypeGuardError } from './TypeGuard'
import { JsonSchema } from './types'
import { Hook, hook } from './hook'

export type KernelType = NonNullable<NonNullable<ISessionContext['session']>['kernel']>
export type CommType = Parameters<Parameters<KernelType['registerCommTarget']>[1]>[0]


const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-stellar-globe:plugin',
  description: '',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, nbTracker: INotebookTracker) => {
    setupNbTracker(app, nbTracker)
  },
}


// registerCommTargetのあたらいは↓を参考に。
// https://github.com/jupyter-widgets/ipywidgets/blob/52663ac472c38ba12575dfb4979fa2d250e79bc3/python/jupyterlab_widgets/src/plugin.ts#L174
function setupNbTracker(app: JupyterFrontEnd, notebooks: INotebookTracker) {
  notebooks.widgetAdded.connect((_, nbPanel) => {
    const onSessionReset = hook()
    const cleanups = new WeakMap<KernelType, () => void>()

    type KernelChangedArgs = Parameters<Parameters<(typeof nbPanel)["sessionContext"]["kernelChanged"]["connect"]>[0]>[1]

    const handleKernelChanged = ({
      oldValue,
      newValue,
    }: KernelChangedArgs): void => {
      console.log({ oldValue, newValue })
      if (oldValue) {
        cleanups.get(oldValue)?.()
      }
      if (newValue) {
        const cleanup = setupCommTarget(app, nbPanel.sessionContext.session!.kernel!, onSessionReset)
        cleanups.set(newValue, cleanup)
      }
    }

    nbPanel.sessionContext.kernelChanged.connect(() => {
      const kernel = nbPanel.sessionContext.session!.kernel!
      const cleanup = setupCommTarget(app, kernel, onSessionReset)
      cleanups.set(kernel, cleanup)
    })

    if (nbPanel.sessionContext.session?.kernel) {
      handleKernelChanged({
        name: 'kernel',
        oldValue: null,
        newValue: nbPanel.sessionContext.session?.kernel,
      })
    }

    nbPanel.sessionContext.statusChanged.connect((_slot, status) => {
      switch (status) {
        case 'autorestarting':
        case 'dead':
        case 'restarting':
        case 'terminating':
          onSessionReset.run()
          break
      }
    })
  })
}


function setupCommTarget(app: JupyterFrontEnd, kernel: KernelType, onSessionReset: Hook) {
  type OnConnected = Parameters<(typeof kernel)["registerCommTarget"]>[1]
  const target = 'stellarglobe/new'
  const cb: OnConnected = function onConnected(comm, rawMsg) {
    const msg = rawMsg.content.data
    catchTypeGuardError(() => {
      assertMessageToStellarGlobeType("openWindow", msg)
      const sgw = new StellarGlobeWindow({
        id: msg.args.id,
        title: msg.args.title,
        onCallback: (msg) => {
          comm.send(msg)
        },
        onDisposed: () => {
          const closed: JsonSchema['MessageToPython']['windowClosed'] = { type: 'windowClosed', args: {} }
          comm.send(closed)
        }
      })
      const widget = sgw.widget
      if (!widget.isAttached) {
        app.shell.add(widget, 'main', { mode: msg.args.layout ?? 'split-right', activate: false })
      }
      // app.shell.activateById(widget.id)
      comm.onMsg = onMessage(sgw)
      onSessionReset.add(() => {
        sgw.close()
      })
    })
  }
  kernel.registerCommTarget(target, cb)
  return () => {
    kernel.removeCommTarget(target, cb)
  }
}


export function onMessage(sgw: StellarGlobeWindow): CommType["onMsg"] {
  return rawMsg => {
    const msg = rawMsg.content.data
    catchTypeGuardError(() => {
      if (!(msg && typeof (msg.type) === 'string')) {
        throw new TypeGuardError(`Invalid Message: ${JSON.stringify(msg)}`)
      }
      if (!sgw.widget.isAttached) {
        alert(`Window(${sgw.id}) is already closed`)
        return
      }
      switch (msg.type as keyof JsonSchema["MessageToJS"]) {
        case 'closeWindow': {
          assertMessageToStellarGlobeType("closeWindow", msg)
          sgw.close()
          break
        }
        case 'setWindowState': {
          assertMessageToStellarGlobeType("setWindowState", msg)
          if (msg.args.title) {
            sgw.widget.title.label = msg.args.title
          }
          break
        }
        case 'showErrorMessage':
          assertMessageToStellarGlobeType('showErrorMessage', msg)
          showErrorMessage(msg.args.title, msg.args.body)
          break
        default:
          sgw.postUnvalidatedMessage(msg as UnvalidatedMessage)
      }
    })
  }
}


export default plugin