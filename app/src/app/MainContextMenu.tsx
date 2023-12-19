import { MenuItem } from '@szhsin/react-menu'
import { ReactNode } from "react"
import { ContextMenu } from '../common/components/ContextMenu'


export function MainContextMenu({ children }: { children: ReactNode }) {
  return (
    <ContextMenu target={children} >
      <MenuItem>OK</MenuItem>
    </ContextMenu>
  )
}
