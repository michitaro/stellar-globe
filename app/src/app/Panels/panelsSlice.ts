import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { regionsSlice } from "../features/regions/regionsSlice"
import { MaterialSymbol } from "material-symbols"
import { hipsLayersSlice } from "../features/hipsLayers/hipsLayersSlice"
import { catalogsSlice } from "../features/catalog/catalogSlice"


type PanelType = 'tone' | 'regions' | 'hips' | 'catalogs' | undefined


type State = {
  selectedPanel: PanelType
}


function initialState(): State {
  return {
    selectedPanel: 'tone',
  }
}


export const panelsSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    selectPanel(state, { payload: panel }: PayloadAction<PanelType>) {
      state.selectedPanel = panel
    },
  },
  extraReducers(builder) {
    builder.addCase(hipsLayersSlice.actions.baseUrlChanged, (state, { payload: { baseUrl } }) => {
      if (baseUrl) {
        state.selectedPanel = 'hips'
      }
    })
    builder.addMatcher(
      action => [
        catalogsSlice.actions.csvTextSubmitted.type,
      ].includes(action.type),
      state => {
        state.selectedPanel = 'catalogs'
      },
    )
    builder.addMatcher(
      action => [
        regionsSlice.actions.newCircularRegionAdded.type,
        regionsSlice.actions.newLinearRegionAdded.type,
        regionsSlice.actions.newRectangularRegionAdded.type,
      ].includes(action.type),
      state => {
        state.selectedPanel = 'regions'
      },
    )
  },
})


export type PanelDef = {
  name: string
  icon: MaterialSymbol
  type: PanelType
}


// ↓の ts-ignore は type-validators を作るときに必要
// @ts-ignore
export const panelDefs: PanelDef[] = [
  {
    name: 'Tone',
    icon: 'tune',
    type: 'tone',
  },
  {
    name: 'Region',
    icon: 'architecture',
    type: 'regions',
  },
  {
    name: 'HiPS',
    icon: 'layers',
    type: 'hips',
  },
  {
    name: 'Catalogs',
    icon: 'table',
    type: 'catalogs',
  }
] as const
