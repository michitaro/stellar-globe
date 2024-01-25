import { SkyCoord } from "@stellar-globe/stellar-globe"
import { AppState } from "."
import { cameraSlice } from "../features/camera/cameraSlice"

export function computedState(state: AppState) {
  const center = normalizeSkyCoord(cameraSlice.selectors.center(state))
  return {
    center,
  }
}

function normalizeSkyCoord(c: SkyCoord) {
  const { a, d } = c
  return [a.rad, d.rad] as [number, number]
}