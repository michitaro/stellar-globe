import { V4 } from "@stellar-globe/stellar-globe"
import { FocusableItem, MenuItem } from "@szhsin/react-menu"
import { Fragment, memo, useCallback, useMemo } from "react"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import { Icon } from "../../../common/components/Icon"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { CircleDef, CircularRegionLayer } from "./CircularRegionLayer"
import { LineDef, LinearRegionLayer } from "./LinearRegionLayer"
import { RectDef, RectangularRegionLayer } from "./RectangularRegionLayer"
import { normalizeSkyCoord, skyCoordFromCoordDef } from "./regionUtils"
import { regionsSlice } from "./regionsSlice"


export function RegionsLayer() {
  const regions = useAppSelector(state => state.regions.regions)

  return (
    <Fragment>
      {regions.filter(r => r.visible).map((def) => {
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
  start,
  end,
  color,
  visible,
}: SpecificRegionType<'Linear'>) => {
  const dispatch = useAppDispatch()

  const original = useMemo(() => ({
    id,
    start,
    end,
    color,
    visible,
  }), [color, end, id, start, visible])

  const onLineDefChange = useCallback((e: LineDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Linear',
        ...original,
        start: normalizeSkyCoord(e.start),
        end: normalizeSkyCoord(e.end),
      },
    }))
  }, [dispatch, id, original])

  const onColorChange = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Linear',
        ...original,
        color,
      },
    }))
  }, [dispatch, id, original])

  const lineDef = useMemo(() => ({
    start: skyCoordFromCoordDef(start),
    end: skyCoordFromCoordDef(end),
  }), [end, start])

  const duplicate = useCallback(() => {
    dispatch(regionsSlice.actions.newLinearRegionAdded({
      type: 'Linear',
      start,
      end,
      visible: true,
    }))
  }, [dispatch, end, start])

  return (
    <LinearRegionLayer
      lineDef={lineDef}
      color={color}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      onChange={onLineDefChange}
    >
      <MenuItem onClick={duplicate}><Icon type='content_copy' marginRight />Duplicate</MenuItem>
      <MenuItem
        onClick={() => {
          dispatch(regionsSlice.actions.regionDeleted({ id }))
        }}
      ><Icon type="delete" marginRight />Delete</MenuItem>
      <ColorPicker color={color} onChange={onColorChange} />
    </LinearRegionLayer>)
})
setDisplayName({ LinearRegionFromDefLayer })


type ColorPickerProps = {
  color: V4
  onChange: (color: V4) => void
}


const ColorPicker = memo(({ color, onChange }: ColorPickerProps) => {
  return (
    <FocusableItem>{
      () => (
        <Fragment>
          <Icon type="palette" marginRight />
          <ColorPickerRgba color={color} onChange={onChange} />
        </Fragment>
      )}
    </FocusableItem>
  )
})


const CircularRegionFromDefLayer = memo(({
  id,
  center,
  radius,
  color,
  visible,
}: SpecificRegionType<'Circular'>) => {
  const dispatch = useAppDispatch()

  const original = useMemo(() => ({
    id,
    center,
    radius,
    color,
    visible,
  }), [center, color, id, radius, visible])

  const onCircleDefChange = useCallback((e: CircleDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Circular',
        ...original,
        center: normalizeSkyCoord(e.center),
        radius: e.radius,
      },
    }))
  }, [dispatch, id, original])

  const onColorChange = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Circular',
        ...original,
        color,
      },
    }))
  }, [dispatch, id, original])

  const circleDef = useMemo(() => ({
    center: skyCoordFromCoordDef(center),
    radius: radius,
  }), [center, radius])

  const duplicate = useCallback(() => {
    dispatch(regionsSlice.actions.newCircularRegionAdded({
      type: 'Circular',
      center,
      radius,
      visible: true,
    }))
  }, [center, dispatch, radius])

  return (
    <CircularRegionLayer
      circleDef={circleDef}
      color={color}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      onChange={onCircleDefChange}
    >
      <MenuItem onClick={duplicate}><Icon type='content_copy' marginRight />Duplicate</MenuItem>
      <ColorPicker color={color} onChange={onColorChange} />
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
  minRa,
  maxRa,
  minDec,
  maxDec,
  color,
  visible,
}: SpecificRegionType<'Rectangular'>) => {
  const dispatch = useAppDispatch()

  const original = useMemo(() => ({
    id,
    minRa,
    maxRa,
    minDec,
    maxDec,
    color,
    visible,
  }), [color, id, maxDec, maxRa, minDec, minRa, visible])

  const onRectDefChange = useCallback(({ minRa, maxRa, minDec, maxDec }: RectDef) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Rectangular',
        ...original,
        minRa, maxRa, minDec, maxDec,
      },
    }))
  }, [dispatch, id, original])


  const onColorChange = useCallback((color: V4) => {
    dispatch(regionsSlice.actions.regionUpdated({
      id,
      regionDef: {
        type: 'Rectangular',
        ...original,
        color,
      },
    }))
  }, [dispatch, id, original])

  const rectDef = useMemo(() => ({
    minRa,
    maxRa,
    minDec,
    maxDec,
  }), [maxDec, maxRa, minDec, minRa])

  return (
    <RectangularRegionLayer
      rectDef={rectDef}
      color={color}
      angleUnit={useAppSelector(state => state.common.angleUnit)}
      onChange={onRectDefChange}
    >
      <MenuItem
        onClick={() => {
          dispatch(regionsSlice.actions.regionDeleted({ id }))
        }}
      ><Icon type="delete" marginRight />Delete</MenuItem>
      <ColorPicker color={color} onChange={onColorChange} />
    </RectangularRegionLayer>
  )
})
setDisplayName({ CircularRegionFromDefLayer })
