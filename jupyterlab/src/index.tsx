import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { ICommandPalette, ISessionContext } from '@jupyterlab/apputils'
import { INotebookTracker } from '@jupyterlab/notebook'
import { StellarGlobeWindow } from './StellarGlobeWindow'
import { OpenWindowMessage } from './types'
import { MessageToStellarGlobe } from './MessageControllableGlobe/messageHandlers'


const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-stellar-globe:plugin',
  description: '',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, nbTracker: INotebookTracker) => {
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
    const msg: OpenWindowMessage = rawMsg.content.data as any
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
      console.log(rawMsg)
      const msg = rawMsg.content.data as MessageToStellarGlobe
      sgw.postMessage(msg)
    }
  })
}
