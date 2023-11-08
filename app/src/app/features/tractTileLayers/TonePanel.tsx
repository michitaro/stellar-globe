import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { ColorParamsControl } from "./ColorParamsControl"
import { tractTileLayersSlice } from "./tractTileLayersSlice"


export function TonePanel() {
  const params = useAppSelector(state => state.tractTileLayers.colorParams)
  const dispatch = useAppDispatch()
  return (
    <ColorParamsControl params={params} onChange={newParams => {
      dispatch(tractTileLayersSlice.actions.colorParamsUpdated({ params: newParams }))
    }} />
  )
}
