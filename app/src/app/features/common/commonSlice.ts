import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AngleUnit } from "../../../common/utils/formatAngle"
import { readStorageState } from "../../store/stateSync/StorageSync"


type State = {
  angleUnit: AngleUnit
  dialogPositionHint: PositionHint
}


function initialState(): State {
  return {
    angleUnit: readStorageState().angleUnit ?? 'sexadecimal',
    dialogPositionHint: readStorageState().dialogPositionHint ?? { top: 8, right: 8 },
  }
}


export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    unitChanged(state, { payload: { angleUnit } }: PayloadAction<{ angleUnit: AngleUnit }>) {
      state.angleUnit = angleUnit
    },
    dialogPositionHintChanged(state, { payload: positionHint }: PayloadAction<PositionHint>) {
      state.dialogPositionHint = positionHint
    },
  },
})


type PositionHint = Partial<Record<'top' | 'bottom' | 'left' | 'right', number>>
