import { resizableY } from "@stellar-globe/react-draggable-dialog"
import { V4 } from "@stellar-globe/stellar-globe"
import { MaterialSymbol } from "material-symbols"
import { Fragment, memo, useCallback } from "react"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import EditableSpan from "../../../common/components/EditableSpan"
import { Icon } from "../../../common/components/Icon"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { AppDialog } from "../../AppDialog"
import { useAppContext } from '../../context'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RegionsMenu } from "./RegionsMenu"
import { Region, regionView, regionsSlice } from "./regionsSlice"
import styles from './styles.module.scss'


export const RegionsDialog = memo(() => {
  const visible = useAppSelector(state => state.regions.regionsDialogVisible)
  const regions = useAppSelector(state => state.regions.regions)
  const dispatch = useAppDispatch()

  return (
    <AppDialog
      title={<Fragment><Icon type="architecture" marginRight />Regions</Fragment>}
      visible={visible}
      resizable={resizableY}
      onCloseButtonClick={() => dispatch(regionsSlice.actions.regionsDialogToggled({}))}
      menu={<RegionsMenu />}
    >
      <table >
        <thead>
          <tr>
            <th><Icon type='category' /></th>
            <th><Icon type='visibility' /></th>
            <th><Icon type='label' /></th>
            <th><Icon type='palette' /></th>
            <th><Icon type='summarize' /></th>
            <th />
          </tr>
        </thead>
        <tbody>
          {regions.map(region => <RegionTr key={region.id} region={region} />)}
        </tbody>
      </table>
    </AppDialog>
  )
})
setDisplayName({ RegionsDialog })


const RegionTr = memo(({ region }: { region: Region }) => {
  const dispatch = useAppDispatch()
  const { type, id, color, visible, showLabel } = region

  const onChangeColor = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, color } }))
  }, [dispatch, id, region])

  const { globeHandle } = useAppContext()

  const goToRegion = () => {
    const { center, fov } = regionView(region)
    globeHandle.current!().camera.jumpTo({ fovy: 2 * fov }, { coord: center })
  }

  return (
    <tr className={styles.regionTr}>
      <td><Icon type={typeIcon[type]} /></td>
      <td>
        <input
          type='checkbox' checked={visible}
          onChange={e => dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, visible: e.currentTarget.checked } }))} />
      </td>
      <td>
        <input
          type='checkbox' checked={showLabel}
          onChange={e => dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, showLabel: e.currentTarget.checked } }))} />
      </td>
      <td>
        <ColorPickerRgba color={color} onChange={onChangeColor} />
      </td>
      <td>
        <EditableSpan
          value={region.name}
          onChange={newName => dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, name: newName } }))} />
      </td>
      <td>
        <div>
          <button
            onClick={goToRegion}
          ><Icon type="location_on" /></button>
          <button
            onClick={() => dispatch(regionsSlice.actions.regionDeleted({ id }))}
          ><Icon type="delete" /></button>
        </div>
      </td>
    </tr>
  )
})

setDisplayName({ RegionTr })


type RegionType = ReturnType<typeof regionsSlice.getInitialState>['regions'][number]['type']


const typeIcon: { [K in RegionType]: MaterialSymbol } = {
  Linear: 'straighten',
  Circular: 'circle',
  Rectangular: 'rectangle',
  Text: 'title',
  Path: 'pentagon',
} as const
