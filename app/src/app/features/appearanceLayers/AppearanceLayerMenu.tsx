import { MenuDivider, MenuItem, SubMenu } from "@szhsin/react-menu"
import { Fragment } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { appearanceLayersSlice } from "./appearanceLayersSlice"

export function AppearanceLayersMenu() {
  const layers = useAppSelector(state => state.layers)
  const dispatch = useAppDispatch()

  return (
    <Fragment>
      <MenuItem type='checkbox' checked={layers.grid.visible} onClick={_ => dispatch(appearanceLayersSlice.actions.visibleToggled('grid'))} >Grid</MenuItem>
      <MenuItem type='checkbox' checked={layers.esoMilkyWay.visible} onClick={_ => dispatch(appearanceLayersSlice.actions.visibleToggled('esoMilkyWay'))} >Eso Milky Way</MenuItem>
      <MenuItem type='checkbox' checked={layers.hipparcosCatalog.visible} onClick={_ => dispatch(appearanceLayersSlice.actions.visibleToggled('hipparcosCatalog'))} >Hipparcos Catalog</MenuItem>
      <MenuItem type='checkbox' checked={layers.nearbyGalaxiesAndNebulas.visible} onClick={_ => dispatch(appearanceLayersSlice.actions.visibleToggled('nearbyGalaxiesAndNebulas'))} >Nearby Galaxies and Nebulas</MenuItem>
      <MenuDivider />
      <SubMenu label="Contellation">
        <MenuItem type='checkbox' checked={layers.constellation.showLines} onClick={_ => dispatch(appearanceLayersSlice.actions.propsUpdated({ which: 'constellation', props: { showLines: !layers.constellation.showLines } }))} >Line</MenuItem>
        <MenuItem type='checkbox' checked={layers.constellation.showNames} onClick={_ => dispatch(appearanceLayersSlice.actions.propsUpdated({ which: 'constellation', props: { showNames: !layers.constellation.showNames } }))} >Name</MenuItem>
        <MenuDivider />
        <MenuItem type='checkbox' checked={layers.constellation.lang === 'English'} onClick={_ => dispatch(appearanceLayersSlice.actions.propsUpdated({ which: 'constellation', props: { lang: 'English' } }))}>English</MenuItem>
        <MenuItem type='checkbox' checked={layers.constellation.lang === 'Kanji'} onClick={_ => dispatch(appearanceLayersSlice.actions.propsUpdated({ which: 'constellation', props: { lang: 'Kanji' } }))}>Japanese</MenuItem>
      </SubMenu>
    </Fragment>
  )
}
