import { DialogContext } from "@stellar-globe/react-draggable-dialog"
import { memo } from "react"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppContext } from "../../context"
import { useAppSelector } from "../../store/hooks"
import { CatalogsDialog } from "../catalog/catalogsDialog"
import { HipsDialog } from "../hipsLayers/HipsDialog"
import { RegionsDialog } from "../regions/RegionsDialog"
import { ToneDialog } from "../tractTileLayers/ToneDialog"
import { CatalogDialogs } from "../catalog/CatalogDialogs"


export const Dialogs = memo(({ portal }: { portal: HTMLElement | undefined }) => {
  const { dialogContext } = useAppContext()
  const positionHint = useAppSelector(state => state.common.dialogPositionHint)

  return (
    <DialogContext
      ref={dialogContext}
      defaultPositionHint={positionHint}
      portal={portal}
    >
      <ToneDialog />
      <RegionsDialog />
      <HipsDialog />
      <CatalogsDialog />
      <CatalogDialogs />
    </DialogContext>
  )
})
setDisplayName({ Dialogs })
