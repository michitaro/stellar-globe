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
          dispatch(panelsSlice.actions.panelChanged(selectedPanel === panelType ? 'none' : panelType))
        },
        shortcut,
      }
      return keybind
    }

    const toggleTonePanel = makeKeybind('tone', 'T')
    const toggleRegionPanel = makeKeybind('regions', 'R')
    const toggleHipsPanel = makeKeybind('hips', 'H')
    const toggleCatalogsPanel = makeKeybind('catalogs', 'C')

    return {
      toggleTonePanel,
      toggleRegionPanel,
      toggleHipsPanel,
      toggleCatalogsPanel,
    }
  }, [dispatch, selectedPanel])
}
