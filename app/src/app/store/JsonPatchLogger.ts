import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { generateJsonPatch } from '../../utils/generateJsonPatch'

type OpList = ReturnType<typeof generateJsonPatch>

export function jsonPatchLogger(callback: (patches: OpList) => void): Middleware {
  return (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    const currentState = api.getState()
    const result = next(action)
    const nextState = api.getState()
    const patches = generateJsonPatch(currentState, nextState)
    callback(patches)
    return result
  }
}
