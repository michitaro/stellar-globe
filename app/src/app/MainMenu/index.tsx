import { MenuBar } from '../../common/components/Menu/MenuBar'
import { CommonMenu } from '../features/common/CommonMenu'
import { DevelMenu } from '../features/devel/DevelMenu'
import { HistoryMenu } from '../features/history/HistoryMenu'
import { ViewMenu } from '../features/view/ViewMenu'
import { DatasetMenu } from './DatasetMenu'
import { ToolsMenu } from './ToolsMenu'
import styles from './styles.module.scss'


export default function MainMenu() {
  return (
    <MenuBar className={styles.menuBar}>
      <CommonMenu />
      <ViewMenu />
      <DatasetMenu />
      <ToolsMenu />
      <HistoryMenu />
      <DevelMenu />
    </MenuBar >
  )
}
