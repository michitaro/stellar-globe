import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { ISessionContext } from '@jupyterlab/apputils'
import { INotebookTracker } from '@jupyterlab/notebook'
import { StellarGlobeWindow } from './StellarGlobeWindow'
import { assertMessageToStellarGlobe, assertOpenWindowMessage, catchTypeGuardError } from './TypeGuard'



const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-stellar-globe:plugin',
  description: '',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, nbTracker: INotebookTracker) => {
    setupNbTracker(app, nbTracker)
  }
}


export default plugin


function setupNbTracker(app: JupyterFrontEnd, nbTracker: INotebookTracker) {
  nbTracker.widgetAdded.connect((_, nbPanel) => {
    nbPanel.sessionContext.connectionStatusChanged.connect(async (session, status) => {
      if (
        status === 'connected' &&
        (await session.session?.kernel?.info)?.language_info.name === 'python' &&
        session.session?.kernel
      ) {
        setupCommTarget(app, session.session.kernel)
      }
    })
  })
}

type KernelType = NonNullable<NonNullable<ISessionContext['session']>['kernel']>

function setupCommTarget(app: JupyterFrontEnd, kernel: KernelType) {
  kernel.registerCommTarget('stellarglobe/new', function onConnected(comm, rawMsg) {
    const msg = rawMsg.content.data
    catchTypeGuardError(() => {
      assertOpenWindowMessage(msg)
      const sgw = new StellarGlobeWindow({
        id: msg.id,
        title: msg.title,
        onCallback: (msg) => {
          console.log(msg)
        },

      })
      const widget = sgw.widget
      if (!widget.isAttached) {
        app.shell.add(widget, 'main', { mode: 'split-right', activate: false })
      }
      // app.shell.activateById(widget.id)
      comm.onMsg = rawMsg => {
        const msg = rawMsg.content.data
        catchTypeGuardError(() => {
          assertMessageToStellarGlobe(msg)
          sgw.postMessage(msg)
        })
      }
    })
  })
}
