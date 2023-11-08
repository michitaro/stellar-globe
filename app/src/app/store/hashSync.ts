import { AppStore, RootState } from "."
import { debounce } from "../../utils/debounce"
import { deserialize, serialize } from "../../utils/serialize"
import { createIs } from "../typeGuard"


export type HashState = Partial<ReturnType<typeof hashState>>


function hashState(state: RootState) {
  return {
    tractTileLayerColorParams: state.tractTileLayers.colorParams,
    cameraParams: state.camera.params,
    datasets: state.tractTileLayers.layers.filter(l => l.visible).map(l => l.name),
  }
}


export function enableHashSync(store: AppStore) {
  const sync = debounce(200, () => {
    changeHashWithoutAddingToHistory(serialize(hashState(store.getState())))
  })

  const cleanup: (() => void)[] = [
    appOnChange(store, state => state.tractTileLayers.colorParams, sync),
    appOnChange(store, state => state.camera.params, sync),
  ]

  return () => {
    while (cleanup.length > 0) {
      cleanup.pop()!()
    }
  }
}


const isValidHashState = createIs<'HashState', HashState>('HashState')


export const readHashState = (() => {
  const getHash = () => location.hash.slice(1)

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

  const rawInput = getHash()
  const value = decode(rawInput)

  return (): HashState => {
    if (rawInput !== getHash()) {
      throw new Error(`Access on hash after load.`)
    }
    return value
  }
})()


function appOnChange<T>(store: AppStore, select: (state: RootState) => T, onChange: (newValue: T, prevValue: T) => void) {
  let prevValue = select(store.getState())

  const onStoreChange = () => {
    const newValue = select(store.getState())
    if (!Object.is(prevValue, newValue)) {
      try {
        onChange(newValue, prevValue)
      } finally {
        prevValue = newValue
      }
    }
  }

  return store.subscribe(onStoreChange)
}


function changeHashWithoutAddingToHistory(newHash: string) {
  const url = window.location.href.split('#')[0]
  history.replaceState(null, '', url + '#' + newHash)
}
