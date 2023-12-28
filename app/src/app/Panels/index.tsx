import { MenuDivider } from "@szhsin/react-menu"
import { Fragment, memo, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import { Icon } from "../../common/components/Icon"
import { Panel } from "../../common/components/Panel"
import { setDisplayName } from "../../common/utils/setDisplayName"
import { MenuItemWithKeybind } from "../keybindings/MenuItemWithKeybind"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelDefs } from "./panelDefs"
import { panelsSlice } from "./panelsSlice"
import styles from './styles.module.scss'
import { HoverMenu } from "../../common/components/Menu/HoverMenu"
import classNames from "classnames"



export function Panels() {
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return (
    <Fragment>
      {panelDefs.map(({ content, icon, name, type, menu }) => (
        <Panel key={type} show={selectedPanel === type} title={
          <Fragment>
            <Icon type={icon} marginRight />
            {name}
          </Fragment>
        }
          panelMenu={<PanelsMenu hasCloseMenu />}
          menu={menu}
        >
          {content}
        </Panel>
      ))}
      <CornerMenu />
    </Fragment >
  )
}



const PanelsMenu = memo(({ hasCloseMenu = false }: { hasCloseMenu?: boolean }) => {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)
  const setSelectedPanel = (panel: typeof selectedPanel) => dispatch(panelsSlice.actions.panelChanged(panel))

  const keybindings = {
    tone: 'toggleTonePanel',
    regions: 'toggleRegionPanel',
    hips: 'toggleHipsPanel',
    catalogs: 'toggleCatalogsPanel',
    none: undefined
  } as const

  return (
    <Fragment>
      {hasCloseMenu && (
        <Fragment>
          <MenuItemWithKeybind keybind="closePanel" disabled={selectedPanel === 'none'} >Close</MenuItemWithKeybind>
          <MenuDivider />
        </Fragment>
      )}
      {
        panelDefs.map(({ icon, name, type }, index) => (
          <MenuItemWithKeybind
            key={index}
            type={selectedPanel && 'checkbox'}
            checked={selectedPanel === type}
            onClick={() => setSelectedPanel(type === selectedPanel ? 'none' : type)}
            keybind={keybindings[type]}
          >
            <Icon type={icon} marginRight />
            {name}
          </MenuItemWithKeybind>
        ))
      }
    </Fragment>
  )
})
setDisplayName({ PanelsMenu })


function CornerMenu() {
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)
  const nodeRef = useRef(null)
  const show = selectedPanel === 'none'

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
      <HoverMenu
        position="anchor"
        className={styles.corner}
        renderMenuButton={({ active }) =>
          <button ref={nodeRef} className={classNames(styles.button, active && styles.active)} ><Icon type="picture_in_picture" /></button>
        }
      >
        <PanelsMenu />
      </HoverMenu>
    </CSSTransition>
  )
}
