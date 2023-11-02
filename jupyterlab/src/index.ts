import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { ISessionContext } from '@jupyterlab/apputils'
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
  }
}


function setupNbTracker(app: JupyterFrontEnd, nbTracker: INotebookTracker) {
  nbTracker.widgetAdded.connect((_, nbPanel) => {
    const onSessionReset = hook()
    nbPanel.sessionContext.connectionStatusChanged.connect(async (sessionContext, status) => {
      if (
        status === 'connected' &&
        (await sessionContext.session?.kernel?.info)?.language_info.name === 'python' &&
        sessionContext.session?.kernel
      ) {
        setupCommTarget(app, sessionContext.session.kernel, onSessionReset)
      }
    })
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
  kernel.registerCommTarget('stellarglobe/new', function onConnected(comm, rawMsg) {
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
  })
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
        default:
          sgw.postUnvalidatedMessage(msg as UnvalidatedMessage)
      }
    })
  }
}


export default plugin