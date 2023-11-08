import { useMemo } from "react"
import { Keybind } from "../../components/keybindings"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelSlice } from "./panelSlice"


export function usePanelKeyBindings() {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return useMemo(() => {
    const togglePanel: Keybind = {
      action() {
        dispatch(panelSlice.actions.selectPanel(selectedPanel === 'tone' ? undefined : 'tone'))
      },
      shortcut: 'C',
    }

    return {
      togglePanel,
    }
  }, [dispatch, selectedPanel])
}
