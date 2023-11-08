import { MenuBar } from '../../components/Menu/MenuBar'
import { ToolsMenu } from '../features/tools/ToolsMenu'
import { DatasetMenu } from '../features/tractTileLayers/DatasetMenu'
import { ViewMenu } from '../features/view/ViewMenu'
import styles from './styles.module.scss'


export default function MainMenu() {
  return (
    <MenuBar className={styles.menuBar}>
      <ViewMenu />
      <DatasetMenu />
      <ToolsMenu />
    </MenuBar >
  )
}
