import { memo } from "react"
import { Icon } from "../../../components/Icon"
import { MenuBarItem } from "../../../components/Menu/MenuBarItem"
import { MenuItemWithKeybind } from "../../keybindings/MenuItemWithKeybind"
import { useAppSelector } from "../../store/hooks"

export const DevelMenu = memo(() => {
  const enabled = useAppSelector(state => state.devel.enabled)
  const profilerActive = useAppSelector(state => state.devel.profilerActive)
  const profilerSupported = useAppSelector(state => state.devel.profilerSupported)

  return (
    enabled && (
      <MenuBarItem label={<Icon type="code" />}>
        <MenuItemWithKeybind
          keybind="toggleProfiler"
          disabled={!profilerSupported}
        >{profilerActive ? 'Stop Profiling' : 'Start Profiling'}</MenuItemWithKeybind>
      </MenuBarItem>
    )
  )
})
