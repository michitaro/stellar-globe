import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import { panelsSlice } from '../Panels/panelsSlice'
import { appearanceLayersSlice } from "../features/appearanceLayers/appearanceLayersSlice"
import { cameraSlice } from "../features/camera/cameraSlice"
import { catalogsSlice } from "../features/catalog/catalogSlice"
import { commonSlice } from "../features/common/commonSlice"
import { develSlice } from "../features/devel/develSlice"
import { hipsLayersSlice } from "../features/hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../features/regions/regionsSlice"
import { tractTileLayersSlice } from '../features/tractTileLayers/tractTileLayersSlice'
import { jsonPatchLogger } from './JsonPatchLogger'
import { makeStateHistory } from "./stateHistory"


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
      catalogs: catalogsSlice.reducer,
      devel: develSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        stateHistory.middleware,
        jsonPatchLogger((patches) => console.log(patches)),
      )
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
