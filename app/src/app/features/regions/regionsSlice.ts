import { createSlice, nanoid } from "@reduxjs/toolkit"
import { SkyCoord, V4 } from "@stellar-globe/stellar-globe"
import { colorSeries } from "../../../common/utils/colorsys"
import { slerp } from "../../../common/utils/math"
import { appStateHistoryActions } from "../../store/hooks"
import { trackAction } from "../../store/stateHistory"
import { readHashState } from "../../store/stateSync/hashSync"
import { skyCoordFromCoordDef } from "./regionUtils"


type ToolType = 'pan' | 'line' | 'rect' | 'circle'


export type Region = LinearRegion | CircularRegion | RectangularRegion


type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>


type State = {
  tool: ToolType
  toolPinned: boolean
  autoColor: boolean
  regions: Region[]
}

function initialState(): State {
  return {
    tool: 'pan',
    toolPinned: false,
    autoColor: true,
    regions: readHashState().regions ?? [],
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
      ({ id: _id, ...rests }: PartiallyPartial<LinearRegion, 'id' | 'color'>) => {
        const id = _id ?? nanoid()
        return trackAction({
          payload: {
            id,
            ...rests,
          },
        }, 'Linear Region Added')
      },
      (state, { payload: { color, id, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
        }
      },
    ),
    newCircularRegionAdded: create.preparedReducer(
      ({ id: _id, ...rests }: PartiallyPartial<CircularRegion, 'id' | 'color'>) => {
        const id = _id ?? nanoid()
        return trackAction({
          payload: {
            id,
            ...rests,
          },
        }, 'Circular Region Added')
      },
      (state, { payload: { id, color, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
        }
      },
    ),
    newRectangularRegionAdded: create.preparedReducer(
      ({ id: _id, ...rests }: PartiallyPartial<RectangularRegion, 'id' | 'color'>) => {
        const id = _id ?? nanoid()
        return trackAction({
          payload: {
            id,
            ...rests,
          }
        }, 'Rectangular Region Added')
      },
      (state, { payload: { id, color, ...rests } }) => {
        if (!state.regions.find(r => r.id === id)) {
          state.regions.push({ ...rests, id, color: color ?? nextColor(state) })
        }
      },
    ),
    regionUpdated: create.preparedReducer(
      (payload: { id: string, regionDef: Region }) => trackAction({ payload }, 'Region Updated'),
      (state, { payload: { id, regionDef } }) => {
        const index = state.regions.findIndex(r => r.id === id)
        if (index >= 0) {
          state.regions[index] = regionDef
        }
      }
    ),
    regionsCleared: create.preparedReducer(
      (payload: {}) => trackAction({ payload, }, 'All Regions Deleted'),
      state => {
        state.regions = []
      }
    ),
    regionDeleted: create.preparedReducer(
      (payload: { id: string }) => trackAction({ payload }, 'Region Deleted'),
      (state, { payload: { id } }) => {
        const index = state.regions.findIndex(r => r.id === id)
        if (index >= 0) {
          state.regions.splice(index, 1)
        }
      },
    ),
  }),
  selectors: {
    nextColor,
  },
  extraReducers(builder) {
    builder.addCase(appStateHistoryActions.setState, (state, { payload: { regions: { regions } } }) => {
      state.regions = regions
    })
  },
})



function nextColor(state: State): V4 {
  if (state.autoColor || state.regions.length === 0) {
    return colorSeries(state.regions.length)
  }
  return state.regions[state.regions.length - 1].color
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


export function regionView(region: Region): { center: SkyCoord, fov: number } {
  switch (region.type) {
    case 'Linear': {
      const start = skyCoordFromCoordDef(region.start)
      const end = skyCoordFromCoordDef(region.end)
      return {
        center: SkyCoord.fromXyz(slerp(start.xyz, end.xyz, 0.5)),
        fov: 2 * start.angle(end).rad,
      }
    }
    case 'Circular': {
      return {
        center: skyCoordFromCoordDef(region.center),
        fov: 2 * region.radius,
      }
    }
    case 'Rectangular': {
      const { maxDec, maxRa, minDec, minRa } = region
      const center = SkyCoord.fromRad((minRa + maxRa) / 2, (minDec + maxDec) / 2)
      const width = Math.max(Math.cos(maxDec), Math.cos(minDec)) * Math.abs(maxRa - minRa)
      const height = Math.abs(maxDec - minDec)
      return {
        center,
        fov: Math.max(width, height),
      }
    }
  }
}
