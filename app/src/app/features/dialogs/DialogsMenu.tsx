import { MenuItem } from "@szhsin/react-menu"
import { memo, useCallback } from "react"
import { Icon } from "../../../common/components/Icon"
import { MenuBarItem } from "../../../common/components/Menu/MenuBarItem"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { tractTileLayersSlice } from "../tractTileLayers/tractTileLayersSlice"

export const DialogsMenu = memo(() => {
  const dispatch = useAppDispatch()
  const ToneVisible = useAppSelector(state => state.tractTileLayers.toneDialogVisible)
  const toneToggle = useCallback(() => dispatch(tractTileLayersSlice.actions.toggleToneDialog({})), [dispatch])


  return (
    <MenuBarItem label={<Icon type='select_window' />} >
      <MenuItem type='checkbox' onClick={toneToggle} checked={ToneVisible}>Tone</MenuItem>
    </MenuBarItem>
  )
})
setDisplayName({ DialogsMenu })