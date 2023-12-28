import { ReactNode } from "react"
import { DragAndDrop } from "../../../common/components/DragAndDrop"
import { useAddCatalogFileList } from "./useAddCatalogFileList"


type Props = {
  children: ReactNode
}


export function CatalogDragAndDrop({ children }: Props) {
  const onDropFiles = useAddCatalogFileList()

  return (
    <DragAndDrop onFileDrop={onDropFiles}>
      {children}
    </DragAndDrop>
  )
}
