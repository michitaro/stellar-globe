import { useMemo } from "react"
import { makeKeybindsEnvironment } from "../../components/keybindings"
import { usePanelKeyBindings } from "../Panels/panelKeybindings"
import { useViewKeybindings } from "../features/view/viewKeybindings"
import { useDevelKeybindings } from "../features/devel/develKeybindings"


export function useAppKeybinds() {
  const viewKeyBindings = useViewKeybindings()
  const panelKeyBindings = usePanelKeyBindings()
  const develKeybindings = useDevelKeybindings()

  return useMemo(() => ({
    ...viewKeyBindings,
    ...panelKeyBindings,
    ...develKeybindings,
  }), [develKeybindings, panelKeyBindings, viewKeyBindings])
}


export const { KeybindsProvider, useKeybindAction, useKeybindShortcut } = makeKeybindsEnvironment(useAppKeybinds)
