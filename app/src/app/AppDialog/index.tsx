import { Fragment, ReactNode, useMemo } from 'react'
import { Dialog } from '@stellar-globe/react-draggable-dialog'
import styles from './style.module.scss'
import { RegularMenu } from '../../common/components/Menu/RegularMenu'
import { Menu, MenuItem } from '@szhsin/react-menu'
import { Icon } from '../../common/components/Icon'
import { useMenuContainer } from '../../common/components/Menu/MenuContext'


type DialogProps = Parameters<typeof Dialog>[0]


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
  menu?: ReactNode
}

export function AppDialog({
  title: rawTitle,
  onCloseButtonClick,
  menu,
  ...rests
}: Props) {

  const container = useMenuContainer()

  const title = useMemo(() => {
    return (
      <Fragment>
        <div className={styles.titlebarText}>
          {rawTitle}
        </div>
        <div className={styles.buttons}>
          {menu && (
            <RegularMenu renderMenuButtonContents={() => <Icon type='menu' />}>
              {menu}
            </RegularMenu>
          )}
          {onCloseButtonClick && (
            <button data-no-dnd onClick={onCloseButtonClick}>
              <Icon type='close' />
            </button>
          )}
        </div>
      </Fragment>
    )
  }, [menu, onCloseButtonClick, rawTitle])

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
