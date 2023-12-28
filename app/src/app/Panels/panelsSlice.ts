import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { catalogsSlice } from "../features/catalog/catalogSlice"
import { hipsLayersSlice } from "../features/hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../features/regions/regionsSlice"


export type PanelType = 'tone' | 'regions' | 'hips' | 'catalogs' | 'none'


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
    panelChanged(state, { payload: panel }: PayloadAction<PanelType>) {
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
