import { createSlice, nanoid } from "@reduxjs/toolkit"
import { V4 } from "@stellar-globe/stellar-globe"
import { readHashState } from "../../store/stateSync/hashSync"
import { hsvToRgb } from "../../../utils/colorsys"


type ToolType = 'pan' | 'line' | 'rect' | 'circle'


export type Region = LinearRegion | CircularRegion | RectangularRegion


type State = {
  tool: ToolType
  toolPinned: boolean
  autoColor: boolean
  regions: Region[]
  showLabel: boolean
}

function initialState(): State {
  return {
    tool: 'pan',
    toolPinned: false,
    autoColor: true,
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
    autoColorToggled: create.reducer(state => {
      state.autoColor = !state.autoColor
    }),
    newLinearRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<LinearRegion, 'id' | 'color'> & { id?: string, color?: V4 }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        }
      }),
      (state, { payload: { color, id, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
        }
      },
    ),
    newCircularRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<CircularRegion, 'id' | 'color'> & { id?: string, color?: V4 }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        },
      }),
      (state, { payload: { id, color, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
        }
      },
    ),
    newRectangularRegionAdded: create.preparedReducer(
      ({ id, ...rests }: Omit<RectangularRegion, 'id' | 'color'> & { id?: string, color?: V4 }) => ({
        payload: {
          id: id ?? nanoid(),
          ...rests,
        }
      }),
      (state, { payload: { id, color, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
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
  selectors: {
    nextColor,
  }
})


function nextColor(state: State): V4 {
  console.log('nextColor')
  if (state.autoColor) {
    return [...hsvToRgb((state.regions.length + 4) / 12, 0.75, 1), 1]
  }
  if (state.regions.length > 0) {
    return state.regions[state.regions.length - 1].color
  }
  return [0, 0.75, 0.25, 1]
}


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
