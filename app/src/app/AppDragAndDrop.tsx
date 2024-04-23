import { ReactNode, useCallback } from "react"
import { DragAndDrop } from "../common/components/DragAndDrop"
import { useAddCatalogFile } from "./features/catalog/useAddCatalogFileList"
import { useAddFitsImageFile } from "./features/fitsImage/useAddFitsImageFile"


type Props = {
  children: ReactNode
}


export function AppDragAndDrop({ children }: Props) {
  const addCatalogFile = useAddCatalogFile()
  const addFitsImageFile = useAddFitsImageFile()
  const onDropFiles = useCallback((fileList: FileList) => {
    for (const file of fileList) {
      const suffix = file.name.toLowerCase().split('.').pop()
      switch (suffix) {
        case 'csv':
          addCatalogFile(file)
          break
        case 'fits':
          addFitsImageFile(file)
          break
        default:
          alert(`Unsupported file type: ${file.name}: ${file.type}`)
      }
    }
  }, [addCatalogFile, addFitsImageFile])

  return (
    <DragAndDrop onFileDrop={onDropFiles}>
      {children}
    </DragAndDrop>
  )
}
