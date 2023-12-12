import { PanLayer$ } from '@stellar-globe/react-stellar-globe'
import { GlobePointerDragEvent, SkyCoord, V4 } from '@stellar-globe/stellar-globe'
import { Fragment, memo, useCallback, useMemo, useState } from 'react'
import { setDisplayName } from '../../../utils/setDisplayName'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { LinearRegionLayer } from './LinearRegionLayer'
import { PointerDragAndUpLayer$ } from './PointerDragLayer'
import { regionsSlice } from './regionsSclie'
import { normalizeSkyCoord } from './utils'


export const ToolsLayer = memo(() => {
  const tool = useAppSelector(state => state.regions.tool)
  const toolPinned = useAppSelector(state => state.regions.toolPinned)
  const dispatch = useAppDispatch()
  const [coords, setCoords] = useState<[SkyCoord, SkyCoord] | null>(null)

  const addRegion = useCallback((start: SkyCoord, end: SkyCoord) => {
    dispatch(regionsSlice.actions.newLinearRegionAdded({
      type: 'Linear',
      start: normalizeSkyCoord(start),
      end: normalizeSkyCoord(end),
      color: [0, 1, 0, 1],
      name: 'MyRegion',
      visible: true,
    }))
    if (!toolPinned) {
      dispatch(regionsSlice.actions.toolChanged({ tool: 'pan' }))
    }
  }, [dispatch, toolPinned])

  const onDrag = useCallback((e: GlobePointerDragEvent) => {
    setCoords([e.downEvent.coord, e.coord])
  }, [])

  const onUp = useCallback((e: GlobePointerDragEvent) => {
    if (e.moved) {
      addRegion(e.downEvent.coord, e.coord)
    }
    setCoords(null)
  }, [addRegion])

  const color = useMemo<V4>(() => [1, 0, 1, 1], [])
  const lineDef = useMemo(() => coords && { start: coords[0], end: coords[1] }, [coords])

  return (
    <Fragment>
      <PanLayer$ enabled={tool === 'pan'} />
      {lineDef && (
        <LinearRegionLayer
          lineDef={lineDef}
          color={color}
          visible
        />
      )}
      <PointerDragAndUpLayer$ enabled={tool === 'line'} onDrag={onDrag} onUp={onUp} />
    </Fragment>
  )
})
setDisplayName({ ToolsLayer })
