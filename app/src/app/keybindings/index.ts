import { useMemo } from "react"
import { makeKeybindsEnvironment } from "../../components/keybindings"
import { usePanelKeyBindings } from "../Panels/panelKeybindings"
import { useDevelKeybindings } from "../features/devel/develKeybindings"
import { useToolsKeybindings } from "../features/regions/toolsKeybindings"
import { useViewKeybindings } from "../features/view/viewKeybindings"


export function useAppKeybinds() {
  const viewKeyBindings = useViewKeybindings()
  const panelKeyBindings = usePanelKeyBindings()
  const develKeybindings = useDevelKeybindings()
  const toolsKeybindings = useToolsKeybindings()

  return useMemo(() => ({
    ...viewKeyBindings,
    ...panelKeyBindings,
    ...develKeybindings,
    ...toolsKeybindings,
  }), [develKeybindings, panelKeyBindings, toolsKeybindings, viewKeyBindings])
}


export const { KeybindsProvider, useKeybindAction, useKeybindShortcut } = makeKeybindsEnvironment(useAppKeybinds)
