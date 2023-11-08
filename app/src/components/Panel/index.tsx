import { ReactNode, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import styles from './styles.module.scss'


type Props = {
  children: ReactNode
  show: boolean
  bottomMenu: ReactNode
}


export function Panel({ children, show, bottomMenu }: Props) {
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
        <div className={styles.panel}>
          {children}
        </div>
        <div className={styles.bottomMenu} >
          {bottomMenu}
        </div>
      </div>
    </CSSTransition >
  )
}
