import { AppState, makeStore } from '@stellar-globe/app'

export function makeJupyterLiteInitialState(storageKey: string): AppState {
  const state = JSON.parse(JSON.stringify(makeStore({ storageKey }).getState())) as AppState & { computed?: unknown }
  delete state.computed
  state.tractTileLayers.layers = state.tractTileLayers.layers.filter(
    (layer: AppState['tractTileLayers']['layers'][number]) => !layer.baseUrl.startsWith('.')
  )
  return state
}
