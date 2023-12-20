import { createSlice } from "@reduxjs/toolkit"
import { appStateHistoryActions } from "../../store/hooks"
import { trackAction } from "../../store/stateHistory"
import { readHashState } from "../../store/stateSync/hashSync"

type State = {
  baseUrl: string | undefined
}

function initialState(): State {
  return {
    baseUrl: readHashState().hipsBaseUrl,
  }
}

export const hipsLayersSlice = createSlice({
  name: 'hipsLayers',
  initialState,
  reducers: create => ({
    baseUrlChanged: create.preparedReducer(
      (payload: { baseUrl?: string }) => trackAction({ payload }, 'HiPS URL Changed'),
      (state, { payload: { baseUrl } }) => {
        state.baseUrl = baseUrl
      },
    ),
    // visibleToggled: create.preparedReducer(
    //   (payload: { visible: boolean }) => trackAction({ payload }, 'HiPS toggled'),
    //   (state, { payload: { visible } }) => {
    //     state.visible = visible
    //   },
    // ),
  }),
  extraReducers(builder) {
    builder.addCase(appStateHistoryActions.setState, (state, { payload: { hipsLayers } }) => {
      state.baseUrl = hipsLayers.baseUrl
    })
  },
})
