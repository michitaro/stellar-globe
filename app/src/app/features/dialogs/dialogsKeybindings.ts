import { useMemo } from "react"
import { Keybind } from "../../../common/components/keybindings"
import { useAppDispatch } from "../../store/hooks"
import { catalogsSlice } from "../catalog/catalogSlice"
import { hipsLayersSlice } from "../hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../regions/regionsSlice"
import { tractTileLayersSlice } from "../tractTileLayers/tractTileLayersSlice"


export function useDialogsKeybindings() {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const toggleToneDialog: Keybind = {
      action: () => {
        dispatch(tractTileLayersSlice.actions.toneDialogToggled({}))
      },
      shortcut: 'T',
    }
    const toggleRegionsDialog: Keybind = {
      action: () => {
        dispatch(regionsSlice.actions.regionsDialogToggled({}))
      },
      shortcut: 'R',
    }
    const toggleHipsDialog: Keybind = {
      action: () => {
        dispatch(hipsLayersSlice.actions.hipsDialogToggled({}))
      },
      shortcut: 'H',
    }
    const toggleCatalogsDialog: Keybind = {
      action: () => {
        dispatch(catalogsSlice.actions.catalogsDialogToggled({}))
      },
      shortcut: 'C',
    }

    return {
      toggleToneDialog,
      toggleRegionsDialog,
      toggleHipsDialog,
      toggleCatalogsDialog,
    }
  }, [dispatch])
}
