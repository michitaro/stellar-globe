import { JupyterFrontEnd } from '@jupyterlab/application'
import { ISessionContext } from '@jupyterlab/apputils'
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook'
import {
  EventEmitter as createEventEmitter,
  type EventEmitter as EventEmitterType,
} from './eventemitter'

export * from './eventemitter'

export type KernelType = NonNullable<NonNullable<ISessionContext['session']>['kernel']>
export type CommType = Parameters<Parameters<KernelType['registerCommTarget']>[1]>[0]
type RawCommOpenMessage = Parameters<Parameters<KernelType['registerCommTarget']>[1]>[1]

export type NotebookCommSessionEnv = {
  app: JupyterFrontEnd
  kernel: KernelType
  notebook: NotebookPanel
  onSessionClosed: EventEmitterType<void>
}

type ConnectNotebookCommTargetOptions = {
  app: JupyterFrontEnd
  notebooks: INotebookTracker
  target: string
  onConnected: (env: NotebookCommSessionEnv, comm: CommType, rawMsg: RawCommOpenMessage) => void
}

type KernelRecord = {
  handledCommIds: Set<string>
  onSessionClosed: EventEmitterType<void>
  refCount: number
}

type PanelRegistration = {
  cleanupTargetRegistration: () => void
  kernelId: string
}

const kernelRecords = new Map<string, KernelRecord>()

export function connectNotebookCommTarget({
  app,
  notebooks,
  target,
  onConnected,
}: ConnectNotebookCommTargetOptions) {
  const attachNotebook = (notebook: NotebookPanel) => {
    const panelState: {
      currentKernel?: KernelType
      currentRegistration?: PanelRegistration
    } = {}

    const releaseCurrentKernel = () => {
      panelState.currentRegistration?.cleanupTargetRegistration()
      if (panelState.currentRegistration) {
        releaseKernelRecord(panelState.currentRegistration.kernelId)
      }
      panelState.currentRegistration = undefined
      panelState.currentKernel = undefined
    }

    const onKernelChanged = (
      _sender: ISessionContext,
      args: Parameters<Parameters<ISessionContext['kernelChanged']['connect']>[0]>[1],
    ) => {
      const nextKernel = args.newValue
      if (nextKernel === panelState.currentKernel) {
        return
      }
      releaseCurrentKernel()
      if (!nextKernel) {
        return
      }

      const kernelId = nextKernel.id
      const kernelRecord = getOrCreateKernelRecord(kernelId)
      kernelRecord.refCount += 1
      const cleanupTargetRegistration = registerCommTarget(nextKernel, target, (comm, rawMsg) => {
        const commId = extractCommId(rawMsg)
        if (commId && kernelRecord.handledCommIds.has(commId)) {
          return
        }
        try {
          if (commId) {
            kernelRecord.handledCommIds.add(commId)
          }
          onConnected({
            app,
            kernel: nextKernel,
            notebook,
            onSessionClosed: kernelRecord.onSessionClosed,
          }, comm, rawMsg)
        }
        catch (error) {
          if (commId) {
            kernelRecord.handledCommIds.delete(commId)
          }
          throw error
        }
      })
      panelState.currentKernel = nextKernel
      panelState.currentRegistration = {
        cleanupTargetRegistration,
        kernelId,
      }
    }

    const onStatusChanged = (_sender: ISessionContext, status: ISessionContext.KernelDisplayStatus) => {
      switch (status) {
        case 'autorestarting':
        case 'dead':
        case 'restarting':
        case 'terminating':
          if (panelState.currentRegistration) {
            const kernelRecord = kernelRecords.get(panelState.currentRegistration.kernelId)
            kernelRecord?.handledCommIds.clear()
            kernelRecord?.onSessionClosed.emit()
          }
          break
      }
    }

    const onDisposed = () => {
      releaseCurrentKernel()
      notebook.sessionContext.kernelChanged.disconnect(onKernelChanged)
      notebook.sessionContext.statusChanged.disconnect(onStatusChanged)
      notebook.disposed.disconnect(onDisposed)
    }

    notebook.sessionContext.kernelChanged.connect(onKernelChanged)
    notebook.sessionContext.statusChanged.connect(onStatusChanged)
    notebook.disposed.connect(onDisposed)
    onKernelChanged(notebook.sessionContext, {
      name: 'kernel',
      oldValue: null,
      newValue: notebook.sessionContext.session?.kernel ?? null,
    })
  }

  notebooks.widgetAdded.connect((_sender, notebook) => {
    attachNotebook(notebook)
  })
  notebooks.forEach(notebook => {
    attachNotebook(notebook)
  })
}

function getOrCreateKernelRecord(kernelId: string) {
  const record = kernelRecords.get(kernelId)
  if (record) {
    return record
  }
  const created: KernelRecord = {
    handledCommIds: new Set(),
    onSessionClosed: createEventEmitter({ once: true }),
    refCount: 0,
  }
  kernelRecords.set(kernelId, created)
  return created
}

function releaseKernelRecord(kernelId: string) {
  const record = kernelRecords.get(kernelId)
  if (!record) {
    return
  }
  record.refCount -= 1
  if (record.refCount <= 0) {
    kernelRecords.delete(kernelId)
  }
}

function extractCommId(rawMsg: RawCommOpenMessage) {
  const content = rawMsg.content as { comm_id?: unknown } | undefined
  return typeof content?.comm_id === 'string' ? content.comm_id : undefined
}

function registerCommTarget(
  kernel: KernelType,
  target: string,
  onConnected: Parameters<KernelType['registerCommTarget']>[1],
) {
  kernel.registerCommTarget(target, onConnected)
  return () => {
    kernel.removeCommTarget(target, onConnected)
  }
}
