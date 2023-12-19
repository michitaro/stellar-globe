import { ControlledMenu } from '@szhsin/react-menu'
import { ReactNode, useMemo, useState } from "react"


export function ContextMenu({ children, target }: { children: ReactNode; target: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const transition = useMemo(() => ({ close: true }), [])
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault()
        setAnchorPoint({ x: e.clientX, y: e.clientY })
        setOpen(true)
      }}
      style={{ height: '100%' }}
    >
      {target}
      <ControlledMenu
        theming='dark'
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        onClose={() => setOpen(false)}
        submenuOpenDelay={0}
        submenuCloseDelay={0}
        transition={transition}
      >
        {children}
      </ControlledMenu>
    </div>
  )
}
