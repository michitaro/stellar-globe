import { memo } from "react"
import { Icon } from "../../../common/components/Icon"
import { MenuBarItem } from "../../../common/components/Menu/MenuBarItem"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { MenuItemWithKeybind } from "../../keybindings/MenuItemWithKeybind"

export const DialogsMenu = memo(() => {
  return (
    <MenuBarItem label={<Icon type='select_window' />} >
      <MenuItemWithKeybind keybind="toggleToneDialog"><Icon type='tune' marginRight />Tone</MenuItemWithKeybind>
      <MenuItemWithKeybind keybind="toggleRegionsDialog"><Icon type='architecture' marginRight />Regions</MenuItemWithKeybind>
      <MenuItemWithKeybind keybind="toggleHipsDialog"><Icon type='layers' marginRight />HiPS</MenuItemWithKeybind>
      <MenuItemWithKeybind keybind="toggleCatalogsDialog"><Icon type='table' marginRight />Catalogs</MenuItemWithKeybind>
    </MenuBarItem>
  )
})
setDisplayName({ DialogsMenu })