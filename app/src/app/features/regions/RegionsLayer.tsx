import { Fragment, memo, useCallback, useMemo } from "react"
import { setDisplayName } from "../../../utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { LineDef, LinearRegionLayer } from "./LinearRegionLayer"
import { regionsSlice } from "./regionsSclie"
import { normalizeSkyCoord, skyCoordFromCoordDef } from "./utils"


export function RegionsLayer() {
  const regions = useAppSelector(state => state.regions.regions)

  return (
    <Fragment>
      {regions.map((def, index) => {
        switch (def.type) {
          case 'Linear':
            return <LinearRegionFromDefLayer key={index} index={index} {...def} />
        }
      })}
    </Fragment>
  )
}


type RegionDef = ReturnType<typeof regionsSlice['getInitialState']>['regions'][number]
type SpecificRegionType<U extends RegionDef['type'], T = RegionDef> = T extends { type: U } ? T : never


const LinearRegionFromDefLayer = memo(({
  name,
  start: startDef,
  end: endDef,
  color,
  visible,
  index,
}: SpecificRegionType<'Linear'> & { index: number }) => {
  const dispatch = useAppDispatch()

  const onChange = useCallback(({ start, end }: LineDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      index,
      regionDef: {
        type: 'Linear',
        name,
        color,
        start: normalizeSkyCoord(start),
        end: normalizeSkyCoord(end),
        visible,
      },
    }))
  }, [color, dispatch, index, name, visible])

  const lineDef = useMemo(() => ({
    start: skyCoordFromCoordDef(startDef),
    end: skyCoordFromCoordDef(endDef),
  }), [endDef, startDef])

  return (
    <LinearRegionLayer
      lineDef={lineDef}
      color={color}
      visible={visible}
      onChange={onChange}
    />)
})
setDisplayName({ LinearRegionFromDefLayer })
