import { DialogContext } from "@stellar-globe/react-draggable-dialog"
import { memo } from "react"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppContext } from "../../context"
import { useAppSelector } from "../../store/hooks"
import { CasJobsDialog } from "../cas/CasJobsDialog"
import { CasSqlDialog } from "../cas/CasSqlDialog"
import { CatalogDialogs } from "../catalog/CatalogDialogs"
import { CatalogsDialog } from "../catalog/catalogsDialog"
import { FitsImagesDialog } from "../fitsImage/fitsImagesDialog"
import { HipsDialog } from "../hipsLayers/HipsDialog"
import { RegionsDialog } from "../regions/RegionsDialog"
import { ToneDialog } from "../tractTileLayers/ToneDialog"


export const Dialogs = memo(({ portal }: { portal: HTMLElement | undefined }) => {
  const { dialogContext } = useAppContext()
  const positionHint = useAppSelector(state => state.common.dialogPositionHint)
  const casEnabled = useAppSelector(state => state.cas.enabled)

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
      <FitsImagesDialog />
      {casEnabled && <CasSqlDialog />}
      {casEnabled && <CasJobsDialog />}
    </DialogContext>
  )
})
setDisplayName({ Dialogs })
