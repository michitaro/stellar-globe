import styles from './styles.module.scss'
import { memo, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Icon } from "../../../common/components/Icon"
import { Region, regionsSlice } from "./regionsSlice"
import { MaterialSymbol } from "material-symbols"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import { V4 } from "@stellar-globe/stellar-globe"

export const RegionsPanels = memo(() => {
  const regions = useAppSelector(state => state.regions.regions)

  return (
    <div>
      <table>
        <caption>Regions</caption>
        <thead>
          <tr>
            <th>Type</th>
            {/* <th>Name</th> */}
            <th></th>
            <th />
          </tr>
        </thead>
        <tbody>
          {regions.map(region => <RegionTr key={region.id} region={region} />)}
        </tbody>
      </table>
    </div>
  )
})
setDisplayName({ RegionsPanels })


const RegionTr = memo(({ region }: { region: Region }) => {
  const dispatch = useAppDispatch()
  const { type, id, color } = region

  const onChangeColor = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({ id, regionDef: { ...region, color } }))
  }, [dispatch, id, region])

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
            onClick={() => dispatch(regionsSlice.actions.regionDeleted({ id }))}
          ><Icon type="delete" /></button>
        </div>
      </td>
    </tr>
  )
})


type RegionType = ReturnType<typeof regionsSlice.getInitialState>['regions'][number]['type']


const typeIcon: { [K in RegionType]: MaterialSymbol } = {
  Linear: 'straighten',
  Circular: 'circle',
  Rectangular: 'rectangle',
} as const
