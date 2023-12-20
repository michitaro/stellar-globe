import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import { panelsSlice } from '../Panels/panelsSlice'
import { appearanceLayersSlice } from "../features/appearanceLayers/appearanceLayersSlice"
import { cameraSlice } from "../features/camera/cameraSlice"
import { commonSlice } from "../features/common/commonSlice"
import { develSlice } from "../features/devel/develSlice"
import { hipsLayersSlice } from "../features/hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../features/regions/regionsSlice"
import { tractTileLayersSlice } from '../features/tractTileLayers/tractTileLayersSlice'
import { makeStateHistory } from "./stateHistory"
// import { jsonPatchLogger } from './JsonPatchLogger'


export function makeStore() {
  const stateHistory = makeStateHistory()

  const store = configureStore({
    reducer: {
      common: commonSlice.reducer,
      appearance: appearanceLayersSlice.reducer,
      camera: cameraSlice.reducer,
      panel: panelsSlice.reducer,
      tractTileLayers: tractTileLayersSlice.reducer,
      hipsLayers: hipsLayersSlice.reducer,
      regions: regionsSlice.reducer,
      devel: develSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      // getDefaultMiddleware().concat(jsonPatchLogger((patches) => console.log(patches))),
      getDefaultMiddleware().concat(stateHistory.middleware)
  })

  return {
    store,
    stateHistory,
  }
}


export type AppStore = ReturnType<typeof makeStore>['store']
export type AppDispatch = AppStore['dispatch']
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>
