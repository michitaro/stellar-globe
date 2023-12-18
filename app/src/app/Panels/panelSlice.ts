import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { regionsSlice } from "../features/regions/regionsSlice"


type PanelType = 'tone' | 'regions' | undefined


type State = {
  selectedPanel: PanelType
}


function initialState(): State {
  return {
    selectedPanel: 'tone',
  }
}


export const panelSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    selectPanel(state, { payload: panel }: PayloadAction<PanelType>) {
      state.selectedPanel = panel
    },
  },
  extraReducers(builder) {
    builder.addMatcher(action => [
      regionsSlice.actions.newCircularRegionAdded.type,
      regionsSlice.actions.newLinearRegionAdded.type,
      regionsSlice.actions.newRectangularRegionAdded.type,
    ].includes(action.type), state => {
      state.selectedPanel = 'regions'
    })
  },
})
