import { useEffect } from "react"
import { AppStore, AppState } from ".."
import { debounce } from "../../../common/utils/debounce"
import { deserialize, serialize } from "../../../common/utils/serialize"
import { createIs } from "../../typeGuard"
import { appOnChange } from "./appOnChange"


export type HashState = Partial<ReturnType<typeof hashState>>


function hashState(state: AppState) {
  return {
    tractTileLayerColorParams: state.tractTileLayers.colorParams,
    cameraParams: state.camera.params,
    projection: state.camera.projection,
    datasets: state.tractTileLayers.layers.filter(l => l.visible).map(l => l.name),
    regions: state.regions.regions,
    hipsBaseUrl: state.hipsLayers.baseUrl,
    appearance: state.appearance,
  }
}


export function useHashSync({
  store, enabled,
}: {
  store: AppStore,
  enabled: boolean,
}) {
  useEffect(() => {
    if (enabled) {
      const sync = debounce(200, () => {
        changeHashWithoutAddingToHistory(serialize(hashState(store.getState())))
      })
      const cleanup: (() => void)[] = [
        appOnChange(store, state => state.tractTileLayers.colorParams, sync),
        appOnChange(store, state => state.camera.params, sync),
        appOnChange(store, state => state.camera.projection, sync),
        appOnChange(store, state => state.regions, sync),
        appOnChange(store, state => state.hipsLayers.baseUrl, sync),
        appOnChange(store, state => state.appearance, sync),
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
  const getRaw = () => location.hash.slice(1)
  const isValidHashState = createIs<HashState>('HashState')

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
    catch {
      /* */
    }
    alert(`Invalid hash string`)
    location.hash = '#'
    location.reload()
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
