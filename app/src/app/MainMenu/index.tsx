import { MenuBar } from '../../components/Menu/MenuBar'
import { DevelMenu } from '../features/devel/DevelMenu'
import { HistoryMenu } from '../features/history/HistoryMenu'
import { ToolsMenu } from '../features/regions/ToolsMenu'
import { DatasetMenu } from '../features/tractTileLayers/DatasetMenu'
import { ViewMenu } from '../features/view/ViewMenu'
import styles from './styles.module.scss'


export default function MainMenu() {
  return (
    <MenuBar className={styles.menuBar}>
      <ViewMenu />
      <DatasetMenu />
      <ToolsMenu />
      <HistoryMenu />
      <DevelMenu />
    </MenuBar >
  )
}
