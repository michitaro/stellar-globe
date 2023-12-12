import { memo } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Icon } from "../../../components/Icon"
import { regionsSlice } from "./regionsSclie"
import { MaterialSymbol } from "material-symbols"
import { setDisplayName } from "../../../utils/setDisplayName"

export const RegionsPanels = memo(() => {
  const regions = useAppSelector(state => state.regions.regions)
  const dispatch = useAppDispatch()

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
          {regions.map((region, index) => (
            <tr key={index}>
              <td> <Icon type={typeIcon[region.type]} /></td>
              {/* <td>{region.name}</td> */}
              <td>
                {/* {JSON.stringify(region)} */}
              </td>
              <td>
                <button
                  onClick={() => dispatch(regionsSlice.actions.regionDeleted({ index }))}
                ><Icon type="delete" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
setDisplayName({ RegionsPanels })


type RegionType = ReturnType<typeof regionsSlice.getInitialState>['regions'][number]['type']


const typeIcon: { [K in RegionType]: MaterialSymbol } = {
  Linear: 'straighten',
  Circular: 'circle',
} as const
