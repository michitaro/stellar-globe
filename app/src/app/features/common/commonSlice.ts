import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { readStorageState } from "../../store/stateSync/StorageSync"
import { AngleUnit } from "../../../common/utils/formatAngle"


type State = {
  angleUnit: AngleUnit
}


function initialState(): State {
  return {
    angleUnit: readStorageState().angleUnit ?? 'sexadecimal',
  }
}


export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    unitChanged(state, { payload: { angleUnit } }: PayloadAction<{ angleUnit: AngleUnit }>) {
      state.angleUnit = angleUnit
    }
  },
})
