import { makeStore } from '@stellar-globe/app'
import { validateAction } from '@stellar-globe/app/actionValidator'
import { FrontendToPython, PythonToFrontend } from './interface'
import { createIs } from './typevalidator'


type InitialMessage = PythonToFrontend['InitialMessage']


export class BadRequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}


export class Comm {
  private queryResponses: Map<string, any> = new Map()
  readonly id: string
  private store: ReturnType<typeof makeStore>
  private revision = 1

  constructor(initialMessage: InitialMessage) {
    this.id = initialMessage.id
    this.store = makeStore({ storageKey: 'reference-comm' })
    this.respondToQuery<'Ready'>(initialMessage.queryId, {
      type: 'Ready',
      revision: this.revision,
      state: this.store.getState(),
    })
  }

  private respondToQuery<K extends keyof FrontendToPython>(queryId: string, response: FrontendToPython[K]) {
    this.queryResponses.set(queryId, response)
  }

  onReceiveMessage(msg: any) {
    if (isDispatchMessage(msg)) {
      if (!validateAction(msg.action)) {
        throw new BadRequestError(`Invalid action: ${JSON.stringify(msg.action)}`)
      }
      return this.store.dispatchAction(msg.action)
    }
    if (isQueryStateMessage(msg)) {
      return this.respondToQuery(msg.queryId, {
        type: 'QueryStateResponse',
        revision: this.revision,
        state: this.store.getState(),
      })
    }
    if (isJumpToMessage(msg)) {
      throw new BadRequestError('JumpTo not implemented')
    }
    throw new BadRequestError(`Invalid message: ${JSON.stringify(msg)}`)
  }

  getQueryResponse(queryId: string) {
    const response = this.queryResponses.get(queryId)
    this.queryResponses.delete(queryId)
    return response
  }

  destroy() {
  }
}


const isDispatchMessage = createIs<PythonToFrontend['Dispatch']>('Dispatch')
const isQueryStateMessage = createIs<PythonToFrontend['QueryState']>('QueryState')
const isJumpToMessage = createIs<PythonToFrontend['JumpTo']>('JumpTo') 
