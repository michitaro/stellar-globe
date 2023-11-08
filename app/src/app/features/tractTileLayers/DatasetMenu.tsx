import { MenuItem } from '@szhsin/react-menu'
import { MenuBarItem } from '../../../components/Menu/MenuBarItem'
import { tractTileLayersSlice } from './tractTileLayersSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'


export function DatasetMenu() {
  const layers = useAppSelector(state => state.tractTileLayers.layers)
  const dispatch = useAppDispatch()

  return (
    <MenuBarItem label="Dataset">
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
    </MenuBarItem>
  )
}
