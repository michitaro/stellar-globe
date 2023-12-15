import { MenuItem } from "@szhsin/react-menu"
import { Fragment, memo, useCallback, useMemo } from "react"
import { Icon } from "../../../components/Icon"
import { setDisplayName } from "../../../utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { CircleDef, CircularRegionLayer } from "./CircularRegionLayer"
import { LineDef, LinearRegionLayer } from "./LinearRegionLayer"
import { RectDef, RectangularRegionLayer } from "./RectangularRegionLayer"
import { regionsSlice } from "./regionsSlice"
import { normalizeSkyCoord, skyCoordFromCoordDef } from "./regionUtils"


export function RegionsLayer() {
  const regions = useAppSelector(state => state.regions.regions)

  return (
    <Fragment>
      {regions.map((def) => {
        switch (def.type) {
          case 'Linear':
            return <LinearRegionFromDefLayer key={def.id} {...def} />
          case 'Circular':
            return <CircularRegionFromDefLayer key={def.id} {...def} />
          case 'Rectangular':
            return <RectangularRegionFromDefLayer key={def.id} {...def} />
        }
      })}
    </Fragment>
  )
}


type RegionDef = ReturnType<typeof regionsSlice['getInitialState']>['regions'][number]
type SpecificRegionType<U extends RegionDef['type'], T = RegionDef> = T extends { type: U } ? T : never


const LinearRegionFromDefLayer = memo(({
  id,
  start: startDef,
  end: endDef,
  color,
  visible,
}: SpecificRegionType<'Linear'>) => {
  const dispatch = useAppDispatch()

  const onChange = useCallback(({ start, end }: LineDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Linear',
        id,
        color,
        start: normalizeSkyCoord(start),
        end: normalizeSkyCoord(end),
        visible,
      },
    }))
  }, [color, dispatch, id, visible])

  const lineDef = useMemo(() => ({
    start: skyCoordFromCoordDef(startDef),
    end: skyCoordFromCoordDef(endDef),
  }), [endDef, startDef])

  return (
    <LinearRegionLayer
      lineDef={lineDef}
      color={color}
      visible={visible}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      onChange={onChange}
    >
      <MenuItem
        onClick={() => {
          dispatch(regionsSlice.actions.regionDeleted({ id }))
        }}
      ><Icon type="delete" marginRight />Delete</MenuItem>
    </LinearRegionLayer>)
})
setDisplayName({ LinearRegionFromDefLayer })



const CircularRegionFromDefLayer = memo(({
  id,
  center: centerDef,
  radius: radiusDef,
  color,
  visible,
}: SpecificRegionType<'Circular'>) => {
  const dispatch = useAppDispatch()

  const onChange = useCallback(({ center, radius }: CircleDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Circular',
        id,
        color,
        center: normalizeSkyCoord(center),
        radius,
        visible,
      },
    }))
  }, [color, dispatch, id, visible])

  const circleDef = useMemo(() => ({
    center: skyCoordFromCoordDef(centerDef),
    radius: radiusDef,
  }), [centerDef, radiusDef])

  return (
    <CircularRegionLayer
      circleDef={circleDef}
      color={color}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      visible={visible}
      onChange={onChange}
    >
      <MenuItem
        onClick={() => {
          dispatch(regionsSlice.actions.regionDeleted({ id }))
        }}
      ><Icon type="delete" marginRight />Delete</MenuItem>
    </CircularRegionLayer>
  )
})
setDisplayName({ CircularRegionFromDefLayer })


const RectangularRegionFromDefLayer = memo(({
  id,
  minRa: minRaDef,
  maxRa: maxRaDef,
  minDec: minDecDef,
  maxDec: maxDecDef,
  color,
  visible,
}: SpecificRegionType<'Rectangular'>) => {
  const dispatch = useAppDispatch()

  const onChange = useCallback(({ minRa, maxRa, minDec, maxDec }: RectDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Rectangular',
        id,
        color,
        minRa,
        maxRa,
        minDec,
        maxDec,
        visible,
      },
    }))
  }, [color, dispatch, id, visible])

  const rectDef = useMemo(() => ({
    minRa: minRaDef,
    maxRa: maxRaDef,
    minDec: minDecDef,
    maxDec: maxDecDef,
  }), [maxDecDef, maxRaDef, minDecDef, minRaDef])

  return (
    <RectangularRegionLayer
      rectDef={rectDef}
      color={color}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      visible={visible}
      onChange={onChange}
    >
      <MenuItem
        onClick={() => {
          dispatch(regionsSlice.actions.regionDeleted({ id }))
        }}
      ><Icon type="delete" marginRight />Delete</MenuItem>
    </RectangularRegionLayer>
  )
})
setDisplayName({ CircularRegionFromDefLayer })
