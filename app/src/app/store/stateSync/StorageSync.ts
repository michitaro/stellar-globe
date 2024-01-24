import { useEffect } from "react"
import { AppState, AppStore, storeInitializerParams } from ".."
import { debounce } from "../../../common/utils/debounce"
import { createIs } from "../../typeGuard"
import { useAppSelector } from "../hooks"
import { appOnChange } from "./appOnChange"


export type StorageState = Partial<ReturnType<typeof localStorageState>>


function localStorageState(state: AppState) {
  return {
    retina: state.camera.retina,
    angleUnit: state.common.angleUnit,
    dialogPositionHint: state.common.dialogPositionHint,
  }
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
  const getRaw = () => window.localStorage.getItem(storageKey())
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
    window.localStorage.removeItem(storageKey())
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
