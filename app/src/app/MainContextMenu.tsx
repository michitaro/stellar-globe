import { MenuDivider, MenuItem } from '@szhsin/react-menu'
import { ReactNode } from "react"
import { ContextMenu } from '../components/ContextMenu'


export function MainContextMenu({ children }: { children: ReactNode }) {
  return (
    <ContextMenu target={children} >
      <MenuItem>OK</MenuItem>
    </ContextMenu>
  )
}
