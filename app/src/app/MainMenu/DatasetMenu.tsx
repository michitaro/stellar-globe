import { MenuDivider, MenuHeader, MenuItem } from '@szhsin/react-menu'
import { MenuBarItem } from '../../common/components/Menu/MenuBarItem'
import { tractTileLayersSlice } from '../features/tractTileLayers/tractTileLayersSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Icon } from '../../common/components/Icon'
import { HipsMenu } from '../features/hipsLayers/hipsMenu'


export function DatasetMenu() {
  const layers = useAppSelector(state => state.tractTileLayers.layers)
  const dispatch = useAppDispatch()

  return (
    <MenuBarItem label={<Icon type="folder" />}>
      <MenuHeader>hscMap</MenuHeader>
      {layers.map(({ baseUrl, name, visible }) => (
        <MenuItem
          type='checkbox'
          key={baseUrl}
          checked={visible}
          onClick={() => {
            dispatch(tractTileLayersSlice.actions.toggleLayer({ name, visible: !visible }))
          }}
        >{name}</MenuItem>
      ))}
      <MenuDivider />
      <MenuHeader>HiPS</MenuHeader>
      <HipsMenu />
    </MenuBarItem>
  )
}
