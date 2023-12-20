import styles from './styles.module.scss'
import { memo, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Icon } from "../../../common/components/Icon"
import { Region, regionView, regionsSlice } from "./regionsSlice"
import { MaterialSymbol } from "material-symbols"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import { V4 } from "@stellar-globe/stellar-globe"
import { useAppContext } from '../../context'

export const RegionsPanel = memo(() => {
  const regions = useAppSelector(state => state.regions.regions)

  return (
    <div>
      <table>
        {/* <caption>Regions</caption> */}
        {/* <thead>
          <tr>
            <th>Type</th>
            <th></th>
            <th />
          </tr>
        </thead> */}
        <tbody>
          {regions.map(region => <RegionTr key={region.id} region={region} />)}
        </tbody>
      </table>
    </div>
  )
})
setDisplayName({ RegionsPanel })


const RegionTr = memo(({ region }: { region: Region }) => {
  const dispatch = useAppDispatch()
  const { type, id, color } = region

  const onChangeColor = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, color } }))
  }, [dispatch, id, region])

  const { globeHandle } = useAppContext()

  const goToRegion = () => {
    const { center, fov } = regionView(region)
    globeHandle.current!().camera.jumpTo({ fovy: 2 * fov }, { coord: center })
  }

  return (
    <tr>
      <td> <Icon type={typeIcon[type]} /></td>
      {/* <td>{id}</td> */}
      <td>
        {/* {JSON.stringify(region)} */}
      </td>
      <td>
        <div className={styles.regionTrButtons}>
          <ColorPickerRgba color={color} onChange={onChangeColor} />
          <button
            onClick={goToRegion}
          ><Icon type="jump_to_element" /></button>
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
} as const
