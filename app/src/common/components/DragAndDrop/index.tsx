import { DragEvent, Fragment, ReactNode, useCallback, useState } from 'react'
import styles from './style.module.scss'

type Props = {
  children: ReactNode
  onFileDrop: (filelist: FileList) => void
}


export function DragAndDrop({ children, onFileDrop }: Props) {
  const [active, setActive] = useState(false)

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setActive(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent) => {
    setActive(false)
  }, [])

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setActive(false)
    const files = e.dataTransfer?.files
    if (files?.length) {
      onFileDrop(files)
    }
  }, [onFileDrop])

  return (
    <Fragment>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={styles.full}
      >
        {children}
      </div>
      {active && <div className={styles.active} />}
    </Fragment>
  )
}
