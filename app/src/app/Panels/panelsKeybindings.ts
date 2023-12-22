import { useMemo } from "react"
import { Keybind } from "../../common/components/keybindings"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelsSlice } from "./panelsSlice"


export function usePanelsKeyBindings() {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return useMemo(() => {
    const makeKeybind = (panelType: typeof selectedPanel, shortcut: string) => {
      const keybind: Keybind = {
        action() {
          dispatch(panelsSlice.actions.selectPanel(selectedPanel === panelType ? undefined : panelType))
        },
        shortcut,
      }
      return keybind
    }

    const toggleTonePanel = makeKeybind('tone', 'C')
    const toggleRegionPanel = makeKeybind('regions', 'R')
    const toggleHipsPanel = makeKeybind('hips', 'Shift+H')
    const toggleCatalogsPanel = makeKeybind('catalogs', 'K')

    return {
      toggleTonePanel,
      toggleRegionPanel,
      toggleHipsPanel,
      toggleCatalogsPanel,
    }
  }, [dispatch, selectedPanel])
}
