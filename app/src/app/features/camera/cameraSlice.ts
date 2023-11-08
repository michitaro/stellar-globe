import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CameraMode, GlobeEventMap } from "@stellar-globe/stellar-globe"
import { readHashState } from "../../store/hashSync"


export type CameraParams = GlobeEventMap['camera-move']


type State = {
  projection: CameraMode
  retina: boolean
  params?: CameraParams
}


function initialState(): State {
  return {
    retina: true,
    projection: 'STEREOGRAPHIC',
    params: readHashState().cameraParams,
  }
}


export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    projectionUpdated(state, { payload: projection }: PayloadAction<CameraMode>) {
      state.projection = projection
    },
    retinaToggled(state) {
      state.retina = !state.retina
    },
    paramsChanged(state, { payload: params }: PayloadAction<CameraParams>) {
      state.params = params
    },
  },
})
