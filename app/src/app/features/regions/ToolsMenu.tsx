import { MenuDivider, MenuItem } from "@szhsin/react-menu"
import { MenuBarItem } from "../../../components/Menu/MenuBarItem"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { regionsSlice } from "./regionsSclie"
import { Icon } from "../../../components/Icon"
import { MaterialSymbol } from "material-symbols"


type ToolType = ReturnType<typeof regionsSlice['getInitialState']>['tool']


const toolDefs: { [K in ToolType]: {
  icon: MaterialSymbol
  displayName: string
}
} = {
  pan: {
    icon: 'open_with',
    displayName: 'Pan',
  },
  circle: {
    icon: 'circle',
    displayName: 'Circular Region',
  },
  line: {
    icon: 'straighten',
    displayName: 'Linear Region',
  },
  rect: {
    icon: 'crop_square',
    displayName: 'Rectangular Region',
  }
} as const


export function ToolsMenu() {
  const selectedTool = useAppSelector(state => state.regions.tool)
  const toolPinned = useAppSelector(state => state.regions.toolPinned)
  const dispatch = useAppDispatch()

  return (
    <MenuBarItem
      label={<Icon type={toolDefs[selectedTool].icon} />}
    >
      {(['pan', 'line', 'circle', 'rect'] as const).map(tool => (
        <MenuItem
          key={tool}
          type='checkbox'
          checked={tool === selectedTool}
          onClick={() => {
            dispatch(regionsSlice.actions.toolChanged({ tool }))
          }}
        >
          <Icon type={toolDefs[tool].icon} marginRight />
          {toolDefs[tool].displayName}
        </MenuItem>
      ))}
      <MenuDivider />
      <MenuItem type="checkbox" checked={toolPinned} onClick={() => dispatch(regionsSlice.actions.toolPinnedToggled())}>Pin tool</MenuItem>
    </MenuBarItem>
  )
}
