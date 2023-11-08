import { createSlice, PayloadAction } from "@reduxjs/toolkit"


type ToolType = 'pan' | 'line' | 'rect' | 'circle'

type State = {
  tool: ToolType
}

function initialState(): State {
  return {
    tool: 'pan',
  }
}

export const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    toolChanged(state, { payload: { tool } }: PayloadAction<{ tool: ToolType }>) {
      state.tool = tool
    },
  },
})
