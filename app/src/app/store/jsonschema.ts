import { Slice } from "@reduxjs/toolkit"
import { StorageState } from "./stateSync/StorageSync"
import { HashState } from "./stateSync/hashSync"

export type JsonSchema = {
  // actions: ExtractAction<typeof appearanceLayersSlice>
  HashState: HashState
  StorageState: StorageState
}


type ExtractAction<T extends Slice> = {
  [K in keyof T["actions"]]: {
    type: T["actions"][K]["type"]
    payload: Parameters<T["actions"][K]>[0]
  }
}
