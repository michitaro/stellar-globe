import { createSlice, nanoid } from "@reduxjs/toolkit"
import { V4 } from "@stellar-globe/stellar-globe"
import { readHashState } from "../../store/stateSync/hashSync"


type ToolType = 'pan' | 'line' | 'rect' | 'circle'


export type Region = LinearRegion | CircularRegion | RectangularRegion


type State = {
  tool: ToolType
  toolPinned: boolean
  regions: Region[]
  showLabel: boolean
}

function initialState(): State {
  return {
    tool: 'pan',
    toolPinned: false,
    regions: readHashState().regions ?? [],
    showLabel: true,
  }
}

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: create => ({
    toolChanged: create.reducer<{ tool: ToolType }>((state, { payload: { tool } }) => {
      state.tool = tool
    }),
    toolPinnedToggled: create.reducer(state => {
      state.toolPinned = !state.toolPinned
    }),
    newLinearRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<LinearRegion, 'id'> & { id?: string }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        }
      }),
      (state, { payload: regionDef }) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
    ),
    newCircularRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<CircularRegion, 'id'> & { id?: string }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        },
      }),
      (state, { payload: regionDef }) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
    ),
    newRectangularRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<RectangularRegion, 'id'> & { id?: string }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        }
      }),
      (state, { payload: regionDef }) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
    ),
    regionUpdated: create.reducer<{ id: string, regionDef: Region }>((state, { payload: { id, regionDef } }) => {
      const index = state.regions.findIndex(r => r.id === id)
      if (index >= 0) {
        state.regions[index] = regionDef
      }
    }),
    regionsCleared: create.reducer(state => {
      state.regions = []
    }),
    regionDeleted: create.reducer<{ id: string }>((state, { payload: { id } }) => {
      const index = state.regions.findIndex(r => r.id === id)
      if (index >= 0) {
        state.regions.splice(index, 1)
      }
    }),
  }),
})


type SkyCoordType = {
  ra: number // radian
  dec: number // radian
}


type RegionBase = {
  id: string
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

export type RectangularRegion = RegionBase & {
  type: 'Rectangular'
  minRa: number // radian
  maxRa: number
  minDec: number
  maxDec: number
  color: V4
}
