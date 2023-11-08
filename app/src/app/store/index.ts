import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import { cameraSlice } from "../features/camera/cameraSlice"
import { appearanceLayersSlice } from "../features/appearanceLayers/appearanceLayersSlice"
import { panelSlice } from '../Panels/panelSlice'
import { tractTileLayersSlice } from '../features/tractTileLayers/tractTileLayersSlice'
import { toolsSlice } from "../features/tools/toolsSclie"
// import { jsonPatchLogger } from './JsonPatchLogger'


export function makeStore() {
  return configureStore({
    reducer: {
      layers: appearanceLayersSlice.reducer,
      camera: cameraSlice.reducer,
      panel: panelSlice.reducer,
      tractTileLayers: tractTileLayersSlice.reducer,
      tools: toolsSlice.reducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(jsonPatchLogger((patches) => console.log(patches))),
  })
}


export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
