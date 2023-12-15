import { MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import { MenuBarItem } from '../../../components/Menu/MenuBarItem'
import { useFullscreen } from '../../../hooks/useFullscreen'
import { useAppContext } from '../../context'
import { MenuItemWithKeybind } from "../../keybindings/MenuItemWithKeybind"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AppearanceLayersMenu } from '../appearanceLayers/AppearanceLayerMenu'
import { cameraSlice } from '../camera/cameraSlice'
import { commonSlice } from '../common/commonSlice'


export function ViewMenu() {
  const { rootElementRef } = useAppContext()
  const { isFullscreen } = useFullscreen(rootElementRef)
  const camera = useAppSelector(state => state.camera)
  const angleUnit = useAppSelector(state => state.common.angleUnit)
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
        <MenuDivider />
        <MenuItemWithKeybind keybind='toggleProjection'>Toggle</MenuItemWithKeybind>
      </SubMenu>
      <MenuDivider />
      <MenuItemWithKeybind type='checkbox' checked={camera.retina} keybind='toggleRetina' >Retina</MenuItemWithKeybind>
      <MenuItemWithKeybind type='checkbox' checked={isFullscreen} disabled={!document.fullscreenEnabled} keybind='toggleFullscreen'>Fullscreen</MenuItemWithKeybind>
      <MenuDivider />
      <MenuItemWithKeybind keybind='moveToCoords'>Move to Specified Coordinates</MenuItemWithKeybind>
      <MenuDivider />
      <SubMenu label="Angle Unit">
        <MenuItem type="checkbox" checked={angleUnit === 'sexadecimal'} onClick={() => dispatch(commonSlice.actions.unitChanged({ angleUnit: 'sexadecimal' }))}>Sexadecimal</MenuItem>
        <MenuItem type="checkbox" checked={angleUnit === 'degree'} onClick={() => dispatch(commonSlice.actions.unitChanged({ angleUnit: 'degree' }))}>Degree</MenuItem>
        <MenuItem type="checkbox" checked={angleUnit === 'radian'} onClick={() => dispatch(commonSlice.actions.unitChanged({ angleUnit: 'radian' }))}>Radian</MenuItem>
      </SubMenu>
    </MenuBarItem>
  )
}
