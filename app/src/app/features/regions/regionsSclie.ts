import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { V3, V4 } from "@stellar-globe/stellar-globe"


type ToolType = 'pan' | 'line' | 'rect' | 'circle'


type Region = LinearRegion | CircularRegion


type State = {
  tool: ToolType
  toolPinned: boolean
  regions: Region[]
}

function initialState(): State {
  return {
    tool: 'pan',
    toolPinned: false,
    regions: [],
  }
}

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    toolChanged(state, { payload: { tool } }: PayloadAction<{ tool: ToolType }>) {
      state.tool = tool
    },
    toolPinnedToggled(state) {
      state.toolPinned = !state.toolPinned
    },
    newLinearRegionAdded(state, { payload: regionDef }: PayloadAction<LinearRegion>) {
      state.regions.push(regionDef)
    },
    regionUpdated(state, { payload: { index, regionDef } }: PayloadAction<{ index: number, regionDef: Region }>) {
      if (index >= state.regions.length) {
        console.error(state.regions, index)
        throw new Error(`Index error`)
      }
      state.regions[index] = regionDef
    },
  },
})


type SkyCoordType = {
  ra: number // radian
  dec: number // radian
}


type RegionBase = {
  name: string
  visible: boolean
}


export type LinearRegion = RegionBase & {
  type: 'Linear'
  start: SkyCoordType
  end: SkyCoordType
  color: V4
}

export type CircularRegion = RegionBase & {
  type: 'Circular'
  center: SkyCoordType
  radius: number // radian
  color: V4
}
