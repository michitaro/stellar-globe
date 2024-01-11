import { Dialog } from '@stellar-globe/react-draggable-dialog'
import { Fragment, ReactNode, useMemo } from 'react'
import { Icon } from '../../common/components/Icon'
import { useMenuContainer } from '../../common/components/Menu/MenuContext'
import { RegularMenu } from '../../common/components/Menu/RegularMenu'
import { useAppContext } from '../context'
import styles from './style.module.scss'


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
  visible,
  rememberPosition,
  ...rests
}: Props) {
  const { active } = useAppContext()
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
      visible={visible && active}
      rememberPosition={rememberPosition || !active}
      {...rests}
    />
  )
}
