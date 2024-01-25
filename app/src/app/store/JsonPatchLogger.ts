import { Middleware } from 'redux'
import { JsonPatchOp, generateJsonPatch } from '../../common/utils/generateJsonPatch'

export function jsonPatchLogger(stateFilter: (state: unknown) => any, callback: (patches: JsonPatchOp[]) => void): Middleware {
  return api => next => action => {
    const currentState = stateFilter(api.getState())
    const result = next(action)
    const nextState = stateFilter(api.getState())
    const patches = generateJsonPatch(currentState, nextState)
    callback(patches)
    return result
  }
}
