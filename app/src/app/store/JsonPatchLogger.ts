import { Middleware } from 'redux'
import { generateJsonPatch } from '../../common/utils/generateJsonPatch'

type OpList = ReturnType<typeof generateJsonPatch>

export function jsonPatchLogger(callback: (patches: OpList) => void): Middleware {
  return api => next => action => {
    const currentState = api.getState()
    const result = next(action)
    const nextState = api.getState()
    const patches = generateJsonPatch(currentState, nextState)
    callback(patches)
    return result
  }
}
