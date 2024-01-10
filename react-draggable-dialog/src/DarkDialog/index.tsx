import { Fragment, useMemo } from 'react'
import { Dialog, DialogProps } from '../Dialog'
import styles from './style.module.scss'


const classNames = {
  dialog: styles.dialog,
  titlebar: styles.titlebar,
  content: styles.content,
  active: styles.active,
}

const {
  appear,
  appearActive,
  appearDone,
  enter,
  enterActive,
  enterDone,
  exit,
  exitActive,
  exitDone,
} = styles

const fadeClassNames = {
  appear,
  appearActive,
  appearDone,
  enter,
  enterActive,
  enterDone,
  exit,
  exitActive,
  exitDone,
}

type Props = Omit<DialogProps, 'classNames' | 'fadeClassNames' | 'fadeDuration'> & {
  onCloseButtonClick?: () => void
}

export function DarkDialog({
  title: rawTitle,
  onCloseButtonClick,
  ...rests
}: Props) {

  const title = useMemo(() => {
    if (onCloseButtonClick) {
      return (
        <Fragment>
          <div className={styles.titlebarText}>
            {rawTitle}
          </div>
          <button
            className={styles.titlebarCloseButton}
            data-no-dnd onClick={onCloseButtonClick}>
            &times;
          </button>
        </Fragment>
      )
    }
    else {
      return rawTitle
    }
  }, [onCloseButtonClick, rawTitle])

  return (
    <Dialog
      classNames={classNames}
      title={title}
      fadeClassNames={fadeClassNames}
      fadeDuration={200}
      {...rests}
    />
  )
}
