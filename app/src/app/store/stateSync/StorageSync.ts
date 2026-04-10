import { useEffect } from "react"
import { AppState, AppStore, storeInitializerParams } from ".."
import { debounce } from "../../../common/utils/debounce"
import { detectEnvironment } from "../../../common/utils/environment"
import { createIs } from "../persistentTypeValidation"
import { appOnChange } from "./appOnChange"


export type StorageState = Partial<ReturnType<typeof localStorageState>>


function localStorageState(state: AppState) {
  return {
    retina: state.camera.retina,
    angleUnit: state.common.angleUnit,
    dialogPositionHint: state.common.dialogPositionHint,
    magFilter: state.common.magFilter,
    cas: {
      releaseName: state.cas.releaseName,
      queueMode: state.cas.queueMode,
      noMail: state.cas.noMail,
      draftSql: state.cas.draftSql,
    },
  }
}

export function normalizeStorageState(unvalidated: unknown) {
  if (!unvalidated || typeof unvalidated !== 'object') {
    return unvalidated
  }

  const state = unvalidated as Record<string, unknown>
  const cas = state.cas
  if (!cas || typeof cas !== 'object') {
    return unvalidated
  }

  const casState = cas as Record<string, unknown>
  if (!('rerun' in casState) && !('presets' in casState)) {
    return unvalidated
  }

  const { rerun: _rerun, presets: _presets, ...normalizedCas } = casState
  return { ...state, cas: normalizedCas }
}


function storageKey() {
  return storeInitializerParams.current().storageKey
}


export function useLocalStorageSync({
  store,
  enabled,
  storageKey,
}: {
  store: AppStore,
  enabled: boolean,
  storageKey: string,
}) {
  useEffect(() => {
    if (enabled) {
      const sync = debounce(200, () => {
        const value = localStorageState(store.getState())
        window.localStorage.setItem(storageKey, JSON.stringify(value))
      })
      const cleanup: (() => void)[] = [
        appOnChange(store, state => state.camera.retina, sync),
        appOnChange(store, state => state.common.angleUnit, sync),
        appOnChange(store, state => state.common.dialogPositionHint, sync),
        appOnChange(store, state => state.common.magFilter, sync),
        appOnChange(store, state => state.cas, sync),
      ]
      return () => {
        while (cleanup.length > 0) {
          cleanup.pop()!()
        }
      }
    }
  }, [enabled, storageKey, store])
}


export const readStorageState = (() => {
  const getRaw = () => {
    if (detectEnvironment() === 'browser' && window.localStorage) {
      return window.localStorage.getItem(storageKey())
    }
    return null
  }
  const isValidStorageState = createIs<StorageState>('StorageState')

  const decode = (raw: string | null) => {
    if (raw === null) {
      return {}
    }
    try {
      const unvalidated = normalizeStorageState(JSON.parse(raw))
      if (isValidStorageState(unvalidated)) {
        return unvalidated
      }
    }
    catch {
      /* */
    }
    alert(`Invalid storage value: ${raw}`)
    window.localStorage.removeItem(storageKey())
    location.reload()
    return {}
  }

  let raw: ReturnType<typeof getRaw>
  let value: ReturnType<typeof decode>

  return (): StorageState => {
    if (raw === undefined) {
      raw = getRaw()
      value = decode(raw)
    }
    if (raw !== getRaw()) {
      throw new Error(`Read on localStorage after load.`)
    }
    // @ts-ignore
    return value
  }
})()
