import { SkyCoord } from "@stellar-globe/stellar-globe"
import { MenuItem } from "@szhsin/react-menu"
import { useMemo } from "react"


type Props = {
  openedAt: SkyCoord
}


export function MainContextMenu({
  openedAt,
}: Props) {

  return (
    <MenuItem>SIMBAD</MenuItem>
  )
}