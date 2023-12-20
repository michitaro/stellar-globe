import { ControlledMenu, useClick, useHover, useMenuState } from '@szhsin/react-menu'
import { Fragment, MutableRefObject, ReactNode, useEffect, useRef } from 'react'


const closers = new Map<MutableRefObject<null>, () => void>()


type Props = {
  renderMenuButton: (state: { active: boolean }) => ReactNode
  children: ReactNode
  className?: string
}


export function HoverMenu({ className, renderMenuButton, children }: Props) {
  const anchorRef = useRef(null)
  const [menuState, toggle] = useMenuState({ transition: { close: true } })
  const clickProps = useClick(menuState.state, toggle)
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle, { openDelay: 0 })

  useEffect(() => {
    closers.set(anchorRef, () => toggle(false))
    return () => {
      closers.delete(anchorRef)
    }
  }, [toggle])

  useEffect(() => {
    if (menuState.state === 'open') {
      for (const [ref, close] of closers) {
        if (ref !== anchorRef) {
          close()
        }
      }
    }
  }, [menuState.state])

  return (
    <Fragment>
      <div ref={anchorRef} {...anchorProps} className={className} {...clickProps}>
        {renderMenuButton({ active: menuState.state === 'open' })}
      </div>
      <ControlledMenu
        overflow='auto'
        {...hoverProps}
        {...menuState}
        theming='dark'
        anchorRef={anchorRef}
        onClose={() => toggle(false)}
        submenuOpenDelay={0}
        submenuCloseDelay={0}
      >
        {children}
      </ControlledMenu>
    </Fragment>
  )
}
