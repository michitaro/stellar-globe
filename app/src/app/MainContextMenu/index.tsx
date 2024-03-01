import { SkyCoord, angle } from "@stellar-globe/stellar-globe"
import { MenuItem, SubMenu } from "@szhsin/react-menu"
import { useBlockUI } from "../../common/components/Modal"
import { catalogsSlice } from "../features/catalog/catalogSlice"
import { useAppDispatch } from "../store/hooks"
import { simbadCatalog } from "./simbad"


type Props = {
  openedAt: SkyCoord
}


export function MainContextMenu({
  openedAt,
}: Props) {
  const dispatch = useAppDispatch()
  const blockUI = useBlockUI()
  const addSymbadCatalog = (radiusAmin: number) => {
    return async () => {
      await blockUI(async () => {
        try {
          const { attributes, markers, fields, } = await simbadCatalog(openedAt, angle.amin2rad(radiusAmin))
          dispatch(catalogsSlice.actions.catalogAdded({
            name: `SIMBAD`,
            fields,
            attributes,
            markers,
          }))
        } catch (e) {
          alert(e)
        }
      })
    }
  }

  return (
    <SubMenu label="SIMBAD">
      <MenuItem onClick={addSymbadCatalog(1)}>1&prime;</MenuItem>
      <MenuItem onClick={addSymbadCatalog(5)}>5&prime;</MenuItem>
      <MenuItem onClick={addSymbadCatalog(10)}>10&prime;</MenuItem>
      <MenuItem onClick={addSymbadCatalog(60)}>1&deg;</MenuItem>
    </SubMenu>
  )
}
