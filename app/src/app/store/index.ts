import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
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
// import { tractTileApi } from "../features/tractTileLayers/FilterDef"


export function makeStore() {
  const stateHistory = makeStateHistory()

  const store = configureStore({
    reducer: {
      [commonSlice.name]: commonSlice.reducer,
      [appearanceLayersSlice.name]: appearanceLayersSlice.reducer,
      [cameraSlice.name]: cameraSlice.reducer,
      [tractTileLayersSlice.name]: tractTileLayersSlice.reducer,
      [hipsLayersSlice.name]: hipsLayersSlice.reducer,
      [regionsSlice.name]: regionsSlice.reducer,
      [catalogsSlice.name]: catalogsSlice.reducer,
      [develSlice.name]: develSlice.reducer,
      // [tractTileApi.reducerPath]: tractTileApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        // tractTileApi.middleware,
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
