import { useMemo } from "react"
import { makeKeybindsEnvironment } from "../../common/components/keybindings"
import { usePanelsKeyBindings } from "../Panels/panelsKeybindings"
import { useDevelKeybindings } from "../features/devel/develKeybindings"
import { useToolsKeybindings } from "../features/regions/toolsKeybindings"
import { useViewKeybindings } from "../features/view/viewKeybindings"
import { useHistoryKeybindings } from "../features/history/historyKeybindings"
import { useSesameKeybindings } from "../features/sesame/SesameKeybindings"


export function useAppKeybinds() {
  const viewKeyBindings = useViewKeybindings()
  const panelKeyBindings = usePanelsKeyBindings()
  const develKeybindings = useDevelKeybindings()
  const toolsKeybindings = useToolsKeybindings()
  const historyKeybindings = useHistoryKeybindings()
  const sesameKeybindings = useSesameKeybindings()

  return useMemo(() => ({
    ...viewKeyBindings,
    ...panelKeyBindings,
    ...develKeybindings,
    ...toolsKeybindings,
    ...historyKeybindings,
    ...sesameKeybindings,
  }), [develKeybindings, historyKeybindings, panelKeyBindings, sesameKeybindings, toolsKeybindings, viewKeyBindings])
}


export const { KeybindsProvider, useKeybindAction, useKeybindShortcut } = makeKeybindsEnvironment(useAppKeybinds)
