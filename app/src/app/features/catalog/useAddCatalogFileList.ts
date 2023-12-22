import { SkyCoord, angle } from "@stellar-globe/stellar-globe"
import { useCallback } from "react"
import { useAppContext } from "../../context"
import { useAppDispatch } from "../../store/hooks"
import { Catalog, catalogsSlice } from "./catalogSlice"


export function useAddCatalogFileList() {
  const dispatch = useAppDispatch()

  return useCallback((filelist: FileList) => {
    for (const file of filelist) {
      if (file.type === 'text/csv') {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          if (text) {
            dispatch(catalogsSlice.actions.csvTextSubmitted({ name: file.name, csvText: text }))
          }
        }
        reader.readAsText(file)
      }
      else {
        alert(`Unsupported file type: ${file.name}: ${file.type}`)
      }
    }
  }, [dispatch])
}


export function useGoToCatalog() {
  const { globeHandle } = useAppContext()
  return useCallback((catalog: Catalog) => {
    if (catalog.markers.length > 0) {
      const coord = SkyCoord.fromXyz(catalog.markers[0].position)
      globeHandle.current!().camera.jumpTo({ fovy: angle.deg2rad(1) }, { coord })
    }
  }, [globeHandle])
}
