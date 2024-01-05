import { useCallback } from "react"
import { AppDialog } from "../../../common/components/AppDialog"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { TonePanel } from "./TonePanel"
import { tractTileLayersSlice } from "./tractTileLayersSlice"

const positionHint = { right: '8px', top: '8px' }

export function ToneDialog() {
  const visible = useAppSelector(state => state.tractTileLayers.toneDialogVisible)
  const dispatch = useAppDispatch()
  const toggle = useCallback(() => dispatch(tractTileLayersSlice.actions.toggleToneDialog({})), [dispatch])

  return (
    <AppDialog
      title="Tone"
      onCloseButtonClick={toggle}
      visible={visible}
      positionHint={positionHint}
    >
      <TonePanel />
    </AppDialog>
  )
}
