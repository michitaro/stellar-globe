import { MenuDivider, MenuItem } from "@szhsin/react-menu"
import { Fragment, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { regionsSlice } from "./regionsSlice"


export function RegionsMenu() {
  const autoColor = useAppSelector(state => state.regions.autoColor)
  const dispatch = useAppDispatch()
  const regions = useAppSelector(state => state.regions.regions)
  const clearRegionsDisabled = useMemo(() => regions.length === 0, [regions.length])

  return (
    <Fragment>
      <MenuItem type="checkbox" checked={autoColor} onClick={() => dispatch(regionsSlice.actions.autoColorToggled())}>Auto Color</MenuItem>
      <MenuItem
        disabled={clearRegionsDisabled}
        onClick={() => dispatch(regionsSlice.actions.regionsCleared({}))}
      >Clear All Regions</MenuItem>
    </Fragment>
  )
}
