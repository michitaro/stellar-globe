import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
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
  reducers: {
    toolChanged(state, { payload: { tool } }: PayloadAction<{ tool: ToolType }>) {
      state.tool = tool
    },
    toolPinnedToggled(state) {
      state.toolPinned = !state.toolPinned
    },
    newLinearRegionAdded: {
      reducer: (state, { payload: regionDef }: PayloadAction<LinearRegion>) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
      prepare: ({ start, end, color, visible }: Omit<LinearRegion, 'id'>) => {
        return {
          payload: {
            type: 'Linear' as const,
            id: nanoid(),
            start, end, color, visible,
          }
        }
      },
    },
    newCircularRegionAdded: {
      reducer: (state, { payload: regionDef }: PayloadAction<CircularRegion>) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
      prepare: ({ center, radius, color, visible }: Omit<CircularRegion, 'id'>) => {
        return {
          payload: {
            type: 'Circular' as const,
            id: nanoid(),
            center, radius, color, visible,
          }
        }
      },
    },
    newRectangularRegionAdded: {
      reducer: (state, { payload: regionDef }: PayloadAction<RectangularRegion>) => {
        if (!state.regions.find(r => r.id === regionDef.id)) {
          state.regions.push(regionDef)
        }
      },
      prepare: ({ minRa, maxRa, minDec, maxDec, visible, color }: Omit<RectangularRegion, 'id'>) => {
        return {
          payload: {
            type: 'Rectangular' as const,
            id: nanoid(),
            minRa, maxRa,
            minDec, maxDec,
            visible,
            color,
          }
        }
      },
    },
    regionUpdated(state, { payload: { id, regionDef } }: PayloadAction<{ id: string, regionDef: Region }>) {
      const index = state.regions.findIndex(r => r.id === id)
      if (index >= 0) {
        state.regions[index] = regionDef
      }
    },
    regionsCleared(state, { payload }: PayloadAction<void>) {
      state.regions = []
    },
    regionDeleted(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      const index = state.regions.findIndex(r => r.id === id)
      if (index >= 0) {
        state.regions.splice(index, 1)
      }
    },
  },
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
