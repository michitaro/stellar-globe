// see /../typescript-typevalidator/README.md

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
import { AppStateWithComputed } from "./computedState"
import { StorageState } from "./stateSync/StorageSync"
import { HashState } from "./stateSync/hashSync"


type AddValidatorName<A, B extends string> = A & { __validatorName__: B }


export type PersistentStateJsonSchema = {
  HashState: AddValidatorName<HashState, 'HashState'>,
  StorageState: AddValidatorName<StorageState, 'StorageState'>
}


export type StoreStateJsonSchema = AddValidatorName<AppStateWithComputed, 'StoreState'>


type SliceName<S extends Slice> = S['name']
type PickAction<A> = A extends { type: string, payload: any } ? A : never
type ActionOfSlice<S extends Slice, ActionName extends keyof S['actions']> = PickAction<ReturnType<S['actions'][ActionName]>>
type ActionsNames<S extends Slice> = keyof S['actions'] & string
type ActionsOfSlice<S extends Slice> = {
  [K in ActionsNames<S>]: AddValidatorName<ActionOfSlice<S, K>, `${SliceName<S>}$${K}`>
}

export type ActionJsonSchema = {
  BaseAction: AddValidatorName<BaseAction, 'BaseAction'>
  Actions: (
    ActionsOfSlice<typeof commonSlice> &
    ActionsOfSlice<typeof appearanceLayersSlice> &
    ActionsOfSlice<typeof cameraSlice> &
    ActionsOfSlice<typeof tractTileLayersSlice> &
    ActionsOfSlice<typeof hipsLayersSlice> &
    ActionsOfSlice<typeof regionsSlice> &
    ActionsOfSlice<typeof catalogsSlice> &
    ActionsOfSlice<typeof develSlice> &
    {}
  )
}
