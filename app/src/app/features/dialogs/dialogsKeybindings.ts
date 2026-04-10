import { useMemo } from "react"
import { Keybind } from "../../../common/components/keybindings"
import { useAppDispatch } from "../../store/hooks"
import { useAppSelector } from "../../store/hooks"
import { catalogsSlice } from "../catalog/catalogSlice"
import { casSlice } from "../cas/casSlice"
import { hipsLayersSlice } from "../hipsLayers/hipsLayersSlice"
import { regionsSlice } from "../regions/regionsSlice"
import { tractTileLayersSlice } from "../tractTileLayers/tractTileLayersSlice"
import { useAppContext } from "../../context"


export function useDialogsKeybindings() {
  const dispatch = useAppDispatch()
  const { dialogContext } = useAppContext()
  const casEnabled = useAppSelector(state => state.cas.enabled)

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
    const toggleCasSqlDialog: Keybind = {
      action: () => {
        if (casEnabled) {
          dispatch(casSlice.actions.sqlDialogToggled({}))
        }
      },
      shortcut: 'Shift+Q',
    }
    const toggleCasJobsDialog: Keybind = {
      action: () => {
        if (casEnabled) {
          dispatch(casSlice.actions.jobsDialogToggled({}))
        }
      },
      shortcut: 'Shift+J',
    }
    const rearrangeDialogs: Keybind = {
      action: () => {
        dialogContext.current!.rearrange()
      },
      shortcut: 'A',
    }
    const closeAllDialogs: Keybind = {
      action: () => {
        dispatch(tractTileLayersSlice.actions.toneDialogToggled({ open: false }))
        dispatch(regionsSlice.actions.regionsDialogToggled({ open: false }))
        dispatch(hipsLayersSlice.actions.hipsDialogToggled({ open: false }))
        dispatch(catalogsSlice.actions.catalogsDialogToggled({ open: false }))
        dispatch(catalogsSlice.actions.dialogsClosed({}))
        dispatch(casSlice.actions.sqlDialogToggled({ open: false }))
        dispatch(casSlice.actions.jobsDialogToggled({ open: false }))
      },
      shortcut: 'X',
    }

    return {
      toggleToneDialog,
      toggleRegionsDialog,
      toggleHipsDialog,
      toggleCatalogsDialog,
      toggleCasSqlDialog,
      toggleCasJobsDialog,
      rearrangeDialogs,
      closeAllDialogs,
    }
  }, [casEnabled, dialogContext, dispatch])
}
