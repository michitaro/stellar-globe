import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { showErrorMessage } from '@jupyterlab/apputils'
import { INotebookTracker } from '@jupyterlab/notebook'
import { connectNotebookCommTarget } from '@stellar-globe/jupyterlab-bridge'
import { ToApp, validateToAppMessage } from '@stellar-globe/app/commTools'
import { makeStellarGlobeWidget } from './StellarGlobeWidget'
import { installTestingHooks } from './testingHooks'


const requiredServices = [INotebookTracker] as unknown as JupyterFrontEndPlugin<void>['requires']


const plugin: JupyterFrontEndPlugin<void> = {
  id: '@stellar-globe/jupyterlab-extension:plugin',
  description: 'A JupyterLab extension for StellarGlobe.',
  autoStart: true,
  requires: requiredServices,
  activate: (app: JupyterFrontEnd, nbTracker: INotebookTracker) => {
    loadExternalCSS('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200')
    installTestingHooks(app, nbTracker)
    connectNotebookCommTarget({
      app,
      notebooks: nbTracker,
      target: 'stellarglobe/new',
      onConnected: ({ app, kernel, onSessionClosed }, comm, rawMsg) => {
        const msg = readMessageData(rawMsg)
        if (!msg) {
          console.warn('Ignoring comm open without message data', rawMsg)
          return
        }
        if (isValidToAppMessage('Open', msg)) {
          const widget = makeStellarGlobeWidget({ app, kernel }, comm, msg)
          onSessionClosed.on(() => {
            widget.close()
          })
          return
        }
        const errors = validateToAppMessage('Open', msg).errors
        console.error('StellarGlobe Comm Type Error', errors)
        void showErrorMessage('StellarGlobe Comm Type Error', JSON.stringify(errors, null, 2))
      },
    })
  },
}


function loadExternalCSS(url: string) {
  const id = 'stellar-globe-fonts-style'
  if (document.getElementById(id)) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  link.id = id
  document.head.appendChild(link)
}


export default plugin
function isValidToAppMessage<T extends keyof ToApp>(type: T, msg: any): msg is ToApp[T] {
  const { errors } = validateToAppMessage(type, msg)
  return errors.length === 0
}


function readMessageData(rawMsg: { content?: { data?: unknown } }) {
  const msg = rawMsg.content?.data
  if (!msg || typeof msg !== 'object') {
    return undefined
  }
  return msg as Record<string, unknown>
}
