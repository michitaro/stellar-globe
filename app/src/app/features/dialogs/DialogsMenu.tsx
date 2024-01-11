import { memo } from "react"
import { Icon } from "../../../common/components/Icon"
import { MenuBarItem } from "../../../common/components/Menu/MenuBarItem"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { MenuItemWithKeybind } from "../../keybindings/MenuItemWithKeybind"
import { useAppSelector } from "../../store/hooks"

export const DialogsMenu = memo(() => {
  const tone = useAppSelector(state => state.tractTileLayers.toneDialogVisible)
  const regions = useAppSelector(state => state.regions.regionsDialogVisible)
  const hips = useAppSelector(state => state.hipsLayers.hipsDialogVisible)
  const catalogs = useAppSelector(state => state.catalogs.catalogsDialogVisible)
  return (
    <MenuBarItem label={<Icon type='select_window' />} >
      <MenuItemWithKeybind type='checkbox' checked={tone} keybind="toggleToneDialog"><Icon type='tune' marginRight />Tone</MenuItemWithKeybind>
      <MenuItemWithKeybind type='checkbox' checked={regions} keybind="toggleRegionsDialog"><Icon type='architecture' marginRight />Regions</MenuItemWithKeybind>
      <MenuItemWithKeybind type='checkbox' checked={hips} keybind="toggleHipsDialog"><Icon type='layers' marginRight />HiPS</MenuItemWithKeybind>
      <MenuItemWithKeybind type='checkbox' checked={catalogs} keybind="toggleCatalogsDialog"><Icon type='table' marginRight />Catalogs</MenuItemWithKeybind>
    </MenuBarItem>
  )
})
setDisplayName({ DialogsMenu })