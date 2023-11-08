import { HTMLAttributes, ReactNode } from "react"
import styles from './styles.module.scss'
import classNames from "classnames"

type Props = {
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function MenuBar({ className, children, ...rests }: Props) {
  return (
    <div className={classNames(className, styles.menuBar)} {...rests}>
      {children}
    </div>
  )
}