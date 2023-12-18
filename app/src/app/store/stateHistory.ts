import { Action, Dispatch, Middleware, MiddlewareAPI, createAction } from '@reduxjs/toolkit'


const setStateKey = 'history/set_state'
const timeTravel = createAction<{ index: number }>('history/time_travel')
const setState = createAction<any>(setStateKey)


export function makeStateHistoryActions<S>() {
  const setState = createAction<S>(setStateKey)
  return {
    setState,
    timeTravel,
  }
}


type Options = {
  maxHistory?: number
}


// eslint-disable-next-line @typescript-eslint/ban-types
type HistoryChagneEvent = {}


export type StateHistoryRecord = {
  state: unknown
  summary?: string
  type: string
  id: number
}


let seq = 0


export const makeStateHistory = ({ maxHistory = 20 }: Options = {}) => {
  const records: StateHistoryRecord[] = []
  let currentIndex = 0
  const changeCallbacks: ((e: HistoryChagneEvent) => void)[] = []

  const middleware = (({ getState }: MiddlewareAPI<Dispatch<Action>, unknown>) => (next: Dispatch<Action>) => (action: Action) => {
    if (timeTravel.match(action)) {
      const { index } = action.payload
      if (0 <= index && index < records.length) {
        currentIndex = index
        const { state } = records[index]
        changeCallbacks.forEach(cb => cb({}))
        return next(setState(state))
      }
    }

    if (records.length === 0) {
      records.unshift({ state: getState(), summary: 'Initial State', type: action.type, id: ++seq })
    }

    const nextAction = next(action)

    if (shouldTrack(action)) {
      records.splice(0, currentIndex)
      currentIndex = 0
      records.unshift({ state: getState(), summary: action.meta[trackKey].summary, type: action.type, id: ++seq })
      while (records.length > maxHistory) {
        records.pop()
      }
      changeCallbacks.forEach(cb => cb({}))
    }

    return nextAction
  }) as Middleware

  return {
    middleware,
    records,
    currentIndex: () => currentIndex,
    onChange: (cb: (e: HistoryChagneEvent) => void) => {
      changeCallbacks.push(cb)
      return () => {
        const i = changeCallbacks.indexOf(cb)
        if (i >= 0) {
          changeCallbacks.splice(i, 1)
        }
      }
    },
  }
}


const trackKey = Symbol('history/track')


type TrackMeta = {
  summary?: string
}


export function trackAction<T>(action: T, summary?: string): T {
  const trackMeta: TrackMeta = {
    summary,
  }
  // @ts-ignore
  action.meta = action.meta ?? {}
  // @ts-ignore
  action.meta[trackKey] = trackMeta
  return action
}


function shouldTrack<A extends Action>(action: A): action is A & { meta: { [trackKey]: TrackMeta } } {
  // @ts-ignore
  return !!action.meta?.[trackKey]
}
