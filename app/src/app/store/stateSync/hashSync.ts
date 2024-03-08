import { useEffect } from "react"
import { AppState, AppStore } from ".."
import { debounce } from "../../../common/utils/debounce"
import { deserialize, serialize } from "../../../common/utils/serialize"
import { appOnChange } from "./appOnChange"
import { detectEnvironment } from "../../../common/utils/environment"
import { createIs } from "../persistentTypeValidation/createIs"


export type HashState = Partial<ReturnType<typeof hashState>>


function hashState(state: AppState, { compact = false }: { compact?: boolean } = {}) {
  return {
    tractTileLayerColorParams: state.tractTileLayers.colorParams,
    cameraParams: state.camera.params,
    projection: state.camera.projection,
    datasets: state.tractTileLayers.layers.filter(l => l.visible).map(l => l.name),
    regions: compact ? [] : state.regions.regions,
    hipsBaseUrl: state.hipsLayers.baseUrl,
    appearance: state.appearanceLayers,
  }
}


export function useHashSync({
  store,
  enabled,
}: {
  store: AppStore
  enabled: boolean
}) {
  useEffect(() => {
    if (enabled) {
      const sync = debounce(200, () => {
        const urlLengthLimit = 2048 // Limit of Google Chrome
        const lengthLimit = urlLengthLimit - getUrlLengthWithoutHash()
        const longHash = serialize(hashState(store.getState()))
        const hash = longHash.length > lengthLimit
          ? serialize(hashState(store.getState(), { compact: true }))
          : longHash
        changeHashWithoutAddingToHistory(hash)
      })
      const cleanup: (() => void)[] = [
        appOnChange(store, state => state.tractTileLayers.colorParams, sync),
        appOnChange(store, state => state.camera.params, sync),
        appOnChange(store, state => state.camera.projection, sync),
        appOnChange(store, state => state.regions, sync),
        appOnChange(store, state => state.hipsLayers.baseUrl, sync),
        appOnChange(store, state => state.appearanceLayers, sync),
      ]
      return () => {
        while (cleanup.length > 0) {
          cleanup.pop()!()
        }
      }
    }
  }, [enabled, store])
}


export const readHashState = (() => {
  const getRaw = () => {
    if (detectEnvironment() === 'browser') {
      return window.location.hash.slice(1)
    }
    return ''
  }

  const isValidHashState = createIs<HashState>("HashState")

  const decode = (hash: string) => {
    if (hash.length == 0) {
      return {}
    }
    try {
      const unvalidated = deserialize(hash)
      if (isValidHashState(unvalidated)) {
        return unvalidated
      }
    }
    catch (e) {
      console.warn('readHashState', e)
    }
    alert(`Invalid hash string`)
    window.location.hash = '#'
    window.location.reload()
    return {} as never
  }

  const rawInput = getRaw()
  const value = decode(rawInput)

  return (): HashState => {
    if (rawInput !== getRaw()) {
      throw new Error(`Read on hash after load.`)
    }
    return value
  }
})()


function changeHashWithoutAddingToHistory(newHash: string) {
  const url = window.location.href.split('#')[0]
  history.replaceState(null, '', url + '#' + newHash)
}


function getUrlLengthWithoutHash() {
  const urlLength = window.location.href.length
  const hashLength = window.location.hash.length
  return urlLength - hashLength
}
