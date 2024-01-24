import { Middleware } from 'redux'
import { JsonPatchOp, generateJsonPatch } from '../../common/utils/generateJsonPatch'

export function jsonPatchLogger(callback: (patches: JsonPatchOp[]) => void): Middleware {
  return api => next => action => {
    const currentState = api.getState()
    const result = next(action)
    const nextState = api.getState()
    const patches = generateJsonPatch(currentState, nextState)
    callback(patches)
    return result
  }
}
