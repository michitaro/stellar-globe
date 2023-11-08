import { MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import { MenuBarItem } from '../../../components/Menu/MenuBarItem'
import { useFullscreen } from '../../../hooks/useFullscreen'
import { useAppContext } from '../../context'
import { MenuItemWithKeybind } from "../../keybindings/MenuItemWithKeybind"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AppearanceLayersMenu } from '../appearanceLayers/AppearanceLayerMenu'
import { cameraSlice } from '../camera/cameraSlice'


export function ViewMenu() {
  const { rootElementRef } = useAppContext()
  const { isFullscreen, toggleFullscreen } = useFullscreen(rootElementRef)
  const camera = useAppSelector(state => state.camera)
  const dispatch = useAppDispatch()

  return (
    <MenuBarItem label="View">
      <SubMenu label='Layers'>
        <AppearanceLayersMenu />
      </SubMenu>
      <SubMenu label="Projection">
        <MenuItem type='checkbox' checked={camera.projection === 'GNOMONIC'} onClick={_ => dispatch(cameraSlice.actions.projectionUpdated('GNOMONIC'))} >Gnomonic</MenuItem>
        <MenuItem type='checkbox' checked={camera.projection === 'STEREOGRAPHIC'} onClick={_ => dispatch(cameraSlice.actions.projectionUpdated('STEREOGRAPHIC'))} >Stereographic</MenuItem>
        <MenuItem type='checkbox' checked={camera.projection === 'FLOATING_EYE'} onClick={_ => dispatch(cameraSlice.actions.projectionUpdated('FLOATING_EYE'))} >Stellar Globe</MenuItem>
      </SubMenu>
      <MenuDivider />
      <MenuItemWithKeybind type='checkbox' checked={camera.retina} keybind='toggleRetina' >Retina</MenuItemWithKeybind>
      <MenuItemWithKeybind type='checkbox' checked={isFullscreen} disabled={!document.fullscreenEnabled} keybind='toggleFullscreen'>Fullscreen</MenuItemWithKeybind>
      <MenuDivider />
      <MenuItemWithKeybind keybind='moveToCoords'>Move to Specified Coordinates</MenuItemWithKeybind>
    </MenuBarItem>
  )
}
