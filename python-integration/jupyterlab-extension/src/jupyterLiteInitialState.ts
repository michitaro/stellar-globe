import { AppState, makeStore } from '@stellar-globe/app'

export function makeJupyterLiteInitialState(storageKey: string): AppState {
  const state = JSON.parse(JSON.stringify(makeStore({ storageKey }).getState())) as AppState & { computed?: unknown }
  delete state.computed
  state.appearanceLayers.esoMilkyWay.visible = false
  state.appearanceLayers.nearbyGalaxiesAndNebulas.visible = false
  state.appearanceLayers.hipparcosCatalog.visible = false
  state.hipsLayers.baseUrl = undefined
  state.tractTileLayers.layers = []
  state.tractTileLayers.toneDialogVisible = false
  return state
}
