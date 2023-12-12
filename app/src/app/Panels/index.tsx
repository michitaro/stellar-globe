import { MenuItem } from "@szhsin/react-menu"
import classNames from "classnames"
import { Fragment, forwardRef, memo, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import { Icon } from "../../components/Icon"
import { HoverMenu } from "../../components/Menu/HoverMenu"
import { Panel } from "../../components/Panel"
import { setDisplayName } from "../../utils/setDisplayName"
import { TonePanel } from "../features/tractTileLayers/TonePanel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { panelSlice } from "./panelSlice"
import styles from './styles.module.scss'
import { RegionsPanels } from "../features/regions/RegionsPanel"


export function Panels() {
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)

  return (
    <div className={styles.panels}>
      <CornerPanelMenu />
      <Panel show={selectedPanel === 'tone'} bottomMenu={<BottomMenu />}>
        <TonePanel />
      </Panel>
      <Panel show={selectedPanel === 'regions'} bottomMenu={<BottomMenu />}>
        <RegionsPanels />
      </Panel>
    </div>
  )
}


const PanelMenu = memo(forwardRef(({ className }: { className?: string }, ref) => {
  const dispatch = useAppDispatch()
  const selectedPanel = useAppSelector(state => state.panel.selectedPanel)
  const setSelectedPanel = (panel: typeof selectedPanel) => dispatch(panelSlice.actions.selectPanel(panel))

  return (
    <HoverMenu
      className={className}
      renderMenuButton={({ active }) =>
        <button className={classNames(styles.menu, active && styles.active)}>
          <Icon type="picture_in_picture" />
        </button>
      }
    >
      <MenuItem type={selectedPanel && 'checkbox'} checked={selectedPanel === 'tone'} onClick={() => setSelectedPanel('tone')} >
        <Icon type="tune" marginRight />
        Tone
      </MenuItem>
      <MenuItem type={selectedPanel && 'checkbox'} checked={selectedPanel === 'regions'} onClick={() => setSelectedPanel('regions')} >
        <Icon type="straighten" marginRight />
        Regions
      </MenuItem>
    </HoverMenu>
  )
}))
setDisplayName({ PanelMenu })


const CloseButton = memo(() => {
  const dispatch = useAppDispatch()
  return (
    <button className={styles.closeButton} onClick={() => dispatch(panelSlice.actions.selectPanel(undefined))}>
      <Icon type="close" />
    </button>
  )
})
setDisplayName({ CloseButton })


const BottomMenu = memo(() => {
  return (
    <Fragment>
      <PanelMenu />
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
      <PanelMenu ref={nodeRef} className={styles.corner} />
    </CSSTransition>
  )
})
setDisplayName({ CornerPanelMenu })
