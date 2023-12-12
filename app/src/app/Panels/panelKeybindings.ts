import { useMemo } from "react"
import { Keybind } from "../../components/keybindings"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelSlice } from "./panelSlice"


export function usePanelKeyBindings() {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return useMemo(() => {
    const makeKeybind = (panelType: typeof selectedPanel, shortcut: string) => {
      const keybind: Keybind = {
        action() {
          dispatch(panelSlice.actions.selectPanel(selectedPanel === panelType ? undefined : panelType))
        },
        shortcut,
      }
      return keybind
    }

    const toggleTonePanel = makeKeybind('tone', 'C')
    const toggleRegionPanel = makeKeybind('regions', 'R')

    return {
      toggleTonePanel,
      toggleRegionPanel,
    }
  }, [dispatch, selectedPanel])
}
