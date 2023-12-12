import { createSlice, PayloadAction } from "@reduxjs/toolkit"


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
})
