import { useMemo } from "react"
import { makeKeybindsEnvironment } from "../../common/components/keybindings"
import { usePanelsKeyBindings } from "../Panels/panelsKeybindings"
import { useDevelKeybindings } from "../features/devel/develKeybindings"
import { useToolsKeybindings } from "../features/regions/toolsKeybindings"
import { useViewKeybindings } from "../features/view/viewKeybindings"
import { useHistoryKeybindings } from "../features/history/historyKeybindings"


export function useAppKeybinds() {
  const viewKeyBindings = useViewKeybindings()
  const panelKeyBindings = usePanelsKeyBindings()
  const develKeybindings = useDevelKeybindings()
  const toolsKeybindings = useToolsKeybindings()
  const historyKeybindings = useHistoryKeybindings()

  return useMemo(() => ({
    ...viewKeyBindings,
    ...panelKeyBindings,
    ...develKeybindings,
    ...toolsKeybindings,
    ...historyKeybindings,
  }), [develKeybindings, historyKeybindings, panelKeyBindings, toolsKeybindings, viewKeyBindings])
}


export const { KeybindsProvider, useKeybindAction, useKeybindShortcut } = makeKeybindsEnvironment(useAppKeybinds)
