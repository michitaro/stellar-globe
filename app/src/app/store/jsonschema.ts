import { Slice } from "@reduxjs/toolkit"
import { HashState } from "./hashSync"

export type JsonSchema = {
  // actions: ExtractAction<typeof appearanceLayersSlice>
  HashState: HashState
}


type ExtractAction<T extends Slice> = {
  [K in keyof T["actions"]]: {
    type: T["actions"][K]["type"]
    payload: Parameters<T["actions"][K]>[0]
  }
}
