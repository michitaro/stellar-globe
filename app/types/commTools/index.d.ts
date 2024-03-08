import { easing } from "@stellar-globe/stellar-globe"

export { generateJsonPatch, JsonPatchOp } from './jsonpatch'
export function validateAction(action: any): { errors: string[] }
export function validateToAppMessage(type: keyof ToApp, message: any): { errors: string[] }


type AddType<T> = {
  [K in keyof T]: T[K] & { type: K }
}

export type FromApp = {
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
}

export type ToApp = {
  Open: {
    id: string
    title?: string
    initialState?: unknown
    queryId: string
    layout?: 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
  }
} & AddType<{
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
    queryId: string
  }
  QuerySnapshot: {
    queryId: string
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
