import { Fragment } from "react"
import { ToneDialog } from "../tractTileLayers/ToneDialog"
import { RegionsDialog } from "../regions/RegionsDialog"
import { HipsDialog } from "../hipsLayers/HipsDialog"
import { CatalogsDialog } from "../catalog/catalogsDialog"


export function Dialogs() {
  return (
    <Fragment>
      <ToneDialog />
      <RegionsDialog />
      <HipsDialog />
      <CatalogsDialog />
    </Fragment>
  )
}
