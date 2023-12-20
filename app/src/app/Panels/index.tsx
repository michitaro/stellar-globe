import { MenuItem } from "@szhsin/react-menu"
import classNames from "classnames"
import { ForwardedRef, Fragment, forwardRef, memo, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import { Icon } from "../../common/components/Icon"
import { HoverMenu } from "../../common/components/Menu/HoverMenu"
import { Panel } from "../../common/components/Panel"
import { setDisplayName } from "../../common/utils/setDisplayName"
import { RegionsPanel } from "../features/regions/RegionsPanel"
import { TonePanel } from "../features/tractTileLayers/TonePanel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelDefs, panelsSlice } from "./panelsSlice"
import styles from './styles.module.scss'
import { MenuItemWithKeybind } from "../keybindings/MenuItemWithKeybind"
import { HipsPanel } from "../features/hipsLayers/HipsPanel"


export function Panels() {
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return (
    <div className={styles.panels}>
      <CornerPanelMenu />
      <Panel show={selectedPanel === 'tone'} bottomMenu={<BottomMenu />}>
        <TonePanel />
      </Panel>
      <Panel show={selectedPanel === 'regions'} bottomMenu={<BottomMenu />}>
        <RegionsPanel />
      </Panel>
      <Panel show={selectedPanel === 'hips'} bottomMenu={<BottomMenu />}>
        <HipsPanel />
      </Panel>
    </div>
  )
}


const PanelsMenu = memo(forwardRef(({ className }: { className?: string }, ref: ForwardedRef<HTMLButtonElement>) => {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)
  const setSelectedPanel = (panel: typeof selectedPanel) => dispatch(panelsSlice.actions.selectPanel(panel))

  const keybindings = {
    tone: 'toggleTonePanel',
    regions: 'toggleRegionPanel',
    hips: 'toggleHipsPanel',
  } as const

  return (
    <HoverMenu
      className={className}
      renderMenuButton={({ active }) =>
        <button ref={ref} className={classNames(styles.menu, active && styles.active)}>
          <Icon type="picture_in_picture" />
        </button>
      }
    >
      {
        panelDefs.map(({ icon, name, type }, index) => (
          <MenuItemWithKeybind
            key={index}
            type={selectedPanel && 'checkbox'}
            checked={selectedPanel === type}
            onClick={() => setSelectedPanel(type)}
            keybind={type && keybindings[type]}
          >
            <Icon type={icon} marginRight />
            {name}
          </MenuItemWithKeybind>
        ))
      }
    </HoverMenu>
  )
}))
setDisplayName({ PanelMenu: PanelsMenu })


const CloseButton = memo(() => {
  const dispatch = useAppDispatch()
  return (
    <button className={styles.closeButton} onClick={() => dispatch(panelsSlice.actions.selectPanel(undefined))}>
      <Icon type="close" />
    </button>
  )
})
setDisplayName({ CloseButton })


const BottomMenu = memo(() => {
  return (
    <Fragment>
      <PanelsMenu />
      <CloseButton />
    </Fragment>
  )
})
setDisplayName({ BottomMenu })


const CornerPanelMenu = memo(() => {
  const show = useAppSelector(state => !state.panel.selectedPanel)
  const nodeRef = useRef(null)
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
      <PanelsMenu ref={nodeRef} className={styles.corner} />
    </CSSTransition>
  )
})
setDisplayName({ CornerPanelMenu })
