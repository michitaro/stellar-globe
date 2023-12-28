import { Globe, SkyCoord, angle } from "@stellar-globe/stellar-globe"
import { useCallback } from "react"
import { useAppContext, useAppGetState } from "../../context"
import { AppState } from "../../store"
import { useAppDispatch } from "../../store/hooks"
import { Catalog, catalogsSlice } from "./catalogSlice"


export function useAddCatalogFileList() {
  const dispatch = useAppDispatch()
  const getState = useAppGetState()
  const stateChangeTrigger = useStateChangeTrigger()
  const { globeHandle } = useAppContext()

  return useCallback((filelist: FileList) => {
    for (const file of filelist) {
      if (file.type === 'text/csv') {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          if (text) {
            stateChangeTrigger({
              executeAction: () => dispatch(catalogsSlice.actions.csvTextSubmitted({ name: file.name, csvText: text })),
              selectState: state => state.catalogs.catalogs.length,
              onStateChange: () => goToCatalog(getState().catalogs.catalogs.slice(-1)[0], globeHandle.current!()),
            })
          }
        }
        reader.readAsText(file)
      }
      else {
        alert(`Unsupported file type: ${file.name}: ${file.type}`)
      }
    }
  }, [dispatch, getState, globeHandle, stateChangeTrigger])
}


function goToCatalog(catalog: Catalog, globe: Globe) {
  if (catalog.markers.length > 0) {
    const coord = SkyCoord.fromXyz(catalog.markers[0].position)
    globe.camera.jumpTo({ fovy: angle.deg2rad(1) }, { coord })
  }
}


export function useGoToCatalog() {
  const { globeHandle } = useAppContext()
  return useCallback((catalog: Catalog) => {
    goToCatalog(catalog, globeHandle.current!())
  }, [globeHandle])
}


function useStateChangeTrigger() {
  const getState = useAppGetState()

  const trigger = useCallback(({ selectState, executeAction, onStateChange }: {
    selectState: (state: AppState) => unknown
    executeAction: () => void
    onStateChange: () => void
  }) => {
    const before = selectState(getState())
    executeAction()
    const after = selectState(getState())
    if (!Object.is(before, after)) {
      onStateChange()
    }
  }, [getState])
  return trigger
}
