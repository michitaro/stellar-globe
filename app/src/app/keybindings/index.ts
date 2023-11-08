import { useMemo } from "react"
import { makeKeybindsEnvironment } from "../../components/keybindings"
import { usePanelKeyBindings } from "../Panels/panelKeybindings"
import { useViewKeybindings } from "../features/view/viewKeybindings"


export function useAppKeybinds() {
  const viewKeyBindings = useViewKeybindings()
  const panelKeyBindings = usePanelKeyBindings()

  return useMemo(() => ({
    ...viewKeyBindings,
    ...panelKeyBindings,
  }), [panelKeyBindings, viewKeyBindings])
}


export const { KeybindsProvider, useKeybindAction, useKeybindShortcut } = makeKeybindsEnvironment(useAppKeybinds)
