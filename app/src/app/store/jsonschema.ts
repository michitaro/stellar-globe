import { Slice } from "@reduxjs/toolkit"
import { BaseAction } from "../context"
import { appearanceLayersSlice } from "../features/appearanceLayers/appearanceLayersSlice"
import { cameraSlice } from "../features/camera/cameraSlice"
import { catalogsSlice } from "../features/catalog/catalogSlice"
import { commonSlice } from "../features/common/commonSlice"
import { develSlice } from "../features/devel/develSlice"
import { hipsLayersSlice } from "../features/hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../features/regions/regionsSlice"
import { tractTileLayersSlice } from "../features/tractTileLayers/tractTileLayersSlice"
import { StorageState } from "./stateSync/StorageSync"
import { HashState } from "./stateSync/hashSync"
import { AppState } from "."
import { computedState } from "./computedState"


type PickAction<A> = A extends { type: string, payload: any } ? A : never
type ActionsNames<S extends Slice> = keyof S['actions']
type ActionsByType<S extends Slice> = {
  [K in ActionsNames<S> as PickAction<ReturnType<S['actions'][K]>>['type']]: {
    type: PickAction<ReturnType<S['actions'][K]>>['type']
    payload: PickAction<ReturnType<S['actions'][K]>>['payload']
  }
}

interface StoreState extends AppState {
  computed: ReturnType<typeof computedState>
} // if we use type instead of interface, we'll get an error from typescript-json-schema.

export type JsonSchema = {
  HashState: HashState
  StorageState: StorageState
  BaseAction: BaseAction
  StoreState: StoreState
  Actions: (
    ActionsByType<typeof commonSlice> &
    ActionsByType<typeof appearanceLayersSlice> &
    ActionsByType<typeof cameraSlice> &
    ActionsByType<typeof tractTileLayersSlice> &
    ActionsByType<typeof hipsLayersSlice> &
    ActionsByType<typeof regionsSlice> &
    ActionsByType<typeof catalogsSlice> &
    ActionsByType<typeof develSlice> &
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  )
}
