import classNames from "classnames"
import { ReactNode, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import { Icon } from "../Icon"
import { HoverMenu } from "../Menu/HoverMenu"
import styles from './styles.module.scss'


type Props = {
  children: ReactNode
  show: boolean
  title: ReactNode
  menu?: ReactNode
  panelMenu: ReactNode
}


export function Panel({ children, show, title, menu, panelMenu }: Props) {
  const nodeRef = useRef(null)

  return (
    <CSSTransition
      in={show}
      timeout={200}
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: styles.fadeEnter,
        enterActive: styles.fadeEnterActive,
        exit: styles.fadeExit,
        exitActive: styles.fadeExitActive,
      }}
    >
      <div ref={nodeRef} className={styles.wrapper}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            {title}
          </div>
          {menu && (
            <HoverMenu
              position="anchor"
              className={styles.menu}
              renderMenuButton={({ active }) =>
                <button className={classNames(active && styles.active)} ><Icon type="menu" /></button>
              }
            >
              {menu}
            </HoverMenu>
          )}
          <HoverMenu
            position="anchor"
            className={styles.menu}
            renderMenuButton={({ active }) =>
              <button className={classNames(active && styles.active)} ><Icon type="picture_in_picture" /></button>
            }
          >
            {panelMenu}
          </HoverMenu>
        </div>
        <div className={styles.panel}>
          {children}
        </div>
      </div >
    </CSSTransition >
  )
}
