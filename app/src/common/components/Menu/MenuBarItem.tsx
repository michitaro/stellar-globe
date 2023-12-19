import { ReactNode } from "react"
import { HoverMenu } from "./HoverMenu"
import styles from './styles.module.scss'
import classNames from "classnames"


type Props = {
  children: ReactNode
  label: ReactNode
}

export function MenuBarItem({ children, label }: Props) {
  return (
    <HoverMenu
      renderMenuButton={({ active }) => (
        <button className={classNames(styles.menuBarItem, active && styles.active)}>{label}</button>
      )}
    >
      {children}
    </HoverMenu>
  )
}
