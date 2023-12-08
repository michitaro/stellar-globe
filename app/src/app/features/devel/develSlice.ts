import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { webglProfileSupported } from "@stellar-globe/stellar-globe"

type State = {
  enabled: boolean
  profilerActive: boolean
  profilerSupported: boolean
}


function initialState(): State {
  return {
    enabled: import.meta.env.DEV,
    profilerActive: false,
    profilerSupported: webglProfileSupported(),
  }
}


export const develSlice = createSlice({
  name: 'devel',
  initialState,
  reducers: {
    profilerToggled: (state, { payload: { active } }: PayloadAction<{ active: boolean }>) => {
      state.profilerActive = active
    },
  },
})
