import { easing } from '@stellar-globe/stellar-globe'


type AddType<T> = {
  [K in keyof T]: T[K] & { type: K }
}


export type InitialMessage = {
  id: string
  title?: string
  layout?: 'split-left' | 'split-right' | 'split-bottom' | 'merge-top' | 'merge-left' | 'merge-right' | 'merge-bottom' | 'tab-before' | 'tab-after'
  initialState?: unknown // AppStateとしたいが、typescript-json-schemaがエラーを起こすのでunknown
  queryId: string
}


export type PythonToFrontend = {
  InitialMessage: InitialMessage
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


export type JsonPatchOp =
  | { op: "add", path: string, value: any }
  | { op: "remove", path: string }
  | { op: "replace", path: string, value: any }
  | { op: "move", path: string, from: string }


export type FrontendToPython = AddType<{
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
}>
