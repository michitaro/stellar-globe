import { MaterialSymbol } from "material-symbols"
import { ReactNode } from "react"
import { CatalogInspector } from "../features/catalog/CatalogInspector"
import { CatalogsMenu, CatalogsPanel } from "../features/catalog/catalogsPanel"
import { HipsPanel } from "../features/hipsLayers/HipsPanel"
import { HipsMenu } from "../features/hipsLayers/hipsMenu"
import { RegionsMenu } from "../features/regions/RegionsMenu"
import { RegionsPanel } from "../features/regions/RegionsPanel"
import { TonePanel } from "../features/tractTileLayers/TonePanel"
import { PanelType } from "./panelsSlice"


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
    icon: 'table_view',
    type: 'catalogs',
    content: <CatalogsPanel />,
    menu: <CatalogsMenu />,
  },
  {
    name: 'Inspector',
    icon: 'table',
    type: 'catalog_inspector',
    content: <CatalogInspector />,
  }
] 
