import { useEffect } from "react"
import { AppStore, AppState } from ".."
import { debounce } from "../../../utils/debounce"
import { createIs } from "../../typeGuard"
import { appOnChange } from "./appOnChange"


export type StorageState = Partial<ReturnType<typeof localStorageState>>


function localStorageState(state: AppState) {
  return {
    retina: state.camera.retina,
    angleUnit: state.common.angleUnit,
  }
}


const STORAGE_KEY = 'stellarglobe5-app'


export function useLocalStorageSync({
  store,
  enabled,
}: {
  store: AppStore,
  enabled: boolean,
}) {
  useEffect(() => {
    if (enabled) {
      const sync = debounce(200, () => {
        setValue(localStorageState(store.getState()))
      })
      const cleanup: (() => void)[] = [
        appOnChange(store, state => state.camera.retina, sync),
      ]
      return () => {
        while (cleanup.length > 0) {
          cleanup.pop()!()
        }
      }
    }
  }, [enabled, store])
}


function setValue(value: StorageState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}


export const readStorageState = (() => {
  const getRaw = () => window.localStorage.getItem(STORAGE_KEY)
  const isValidStorageState = createIs<StorageState>('StorageState')

  const decode = (raw: string | null) => {
    if (raw === null) {
      return {}
    }
    try {
      const unvalidated = JSON.parse(raw)
      if (isValidStorageState(unvalidated)) {
        return unvalidated
      }
    }
    catch {
      /* */
    }
    alert(`Invalid storage value`)
    window.localStorage.removeItem(STORAGE_KEY)
    return {}
  }

  const raw = getRaw()
  const value = decode(raw)

  return (): StorageState => {
    if (raw !== getRaw()) {
      throw new Error(`Read on localStorage after load.`)
    }
    // @ts-ignore
    return value
  }
})()
