import { MaterialSymbol } from "material-symbols"
import { Fragment, ReactNode } from "react"
import { CatalogsMenu, CatalogsPanel } from "../features/catalog/catalogsPanel"
import { HipsPanel } from "../features/hipsLayers/HipsPanel"
import { RegionsPanel } from "../features/regions/RegionsPanel"
import { TonePanel } from "../features/tractTileLayers/TonePanel"
import { PanelType } from "./panelsSlice"
import { RegionsMenu } from "../features/regions/RegionsMenu"
import { HipsMenu } from "../features/hipsLayers/hipsMenu"


export type PanelDef = {
  name: string
  icon: MaterialSymbol
  type: PanelType
  content: ReactNode
  menu?: ReactNode
}


export const panelDefs: PanelDef[] = [
  {
    name: 'Tone',
    icon: 'tune',
    type: 'tone',
    content: <TonePanel />,
  },
  {
    name: 'Region',
    icon: 'architecture',
    type: 'regions',
    content: <RegionsPanel />,
    menu: <RegionsMenu />
  },
  {
    name: 'HiPS',
    icon: 'layers',
    type: 'hips',
    content: <HipsPanel />,
    menu: <HipsMenu />,
  },
  {
    name: 'Catalogs',
    icon: 'table',
    type: 'catalogs',
    content: <CatalogsPanel />,
    menu: <CatalogsMenu />,
  }
] 
