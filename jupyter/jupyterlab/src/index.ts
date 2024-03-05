import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { INotebookTracker } from '@jupyterlab/notebook'
import { StellarGlobeWidgetParams, makeStellarGlobeWidget } from './StellarGlobeWidget'
import { EventEmitter } from './eventemitter'
import { createIs } from './typevalidator'
import { KernelType, StellarGlobeSessionEnv } from './types'


const plugin: JupyterFrontEndPlugin<void> = {
  id: '@stellarglobe/jupyterlab:plugin',
  description: 'A JupyterLab extension for StellarGlobe.',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, nbTracker: INotebookTracker) => {
    connectToKernelChangedSignalForCommCreation(app, nbTracker)
  },
}


export default plugin


// registerCommTargetのあたらいは↓を参考に。
// https://github.com/jupyter-widgets/ipywidgets/blob/52663ac472c38ba12575dfb4979fa2d250e79bc3/python/jupyterlab_widgets/src/plugin.ts#L174
function connectToKernelChangedSignalForCommCreation(
  app: JupyterFrontEnd,
  notebooks: INotebookTracker,
) {
  notebooks.widgetAdded.connect((_, nbPanel) => {
    const onSessionClosed = EventEmitter({ once: true })
    const cleanups = new WeakMap<KernelType, () => void>()

    type KernelChangedArgs = Parameters<Parameters<(typeof nbPanel)["sessionContext"]["kernelChanged"]["connect"]>[0]>[1]

    const handleKernelChanged = ({
      oldValue,
      newValue,
    }: KernelChangedArgs): void => {
      if (oldValue) {
        cleanups.get(oldValue)?.()
      }
      if (newValue) {
        const kernel = nbPanel.sessionContext.session!.kernel!
        const cleanup = setupCommTarget({ app, kernel }, onSessionClosed)
        cleanups.set(newValue, cleanup)
      }
    }

    nbPanel.sessionContext.kernelChanged.connect(() => {
      const kernel = nbPanel.sessionContext.session!.kernel!
      const cleanup = setupCommTarget({ app, kernel }, onSessionClosed)
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
          onSessionClosed.emit()
          break
      }
    })
  })
}


const isValidStellarGlobeWidgetParams = createIs<StellarGlobeWidgetParams>('StellarGlobeWidgetParams')


function setupCommTarget(env: StellarGlobeSessionEnv, onSessionClosed: EventEmitter) {
  const target = 'stellarglobe/new'
  return registerCommTarget(env.kernel, target, function onConnected(comm, rawMsg) {
    const msg = rawMsg.content.data
    if (isValidStellarGlobeWidgetParams(msg)) {
      const widget = makeStellarGlobeWidget(env, comm, msg)
      onSessionClosed.on(() => {
        widget.close()
      })
    }
    else {
      alert(`Type error:\n${JSON.stringify(isValidStellarGlobeWidgetParams.errors, null, 2)}`)
    }
  })
}


function registerCommTarget(
  kernel: KernelType,
  target: string,
  onConnected: Parameters<KernelType["registerCommTarget"]>[1],
) {
  kernel.registerCommTarget(target, onConnected)
  return () => {
    kernel.removeCommTarget(target, onConnected)
  }
}
