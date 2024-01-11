import { DialogContext } from '@stellar-globe/react-draggable-dialog'
import '@stellar-globe/react-draggable-dialog/style.css'
import '@szhsin/react-menu/dist/index.css'
import classNames from 'classnames'
import 'material-symbols/outlined.css'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Provider } from "react-redux"
import { MenuProvider } from '../common/components/Menu/MenuContext'
import { ModalProvider } from '../common/components/Modal'
import { useIsFullscreen } from '../common/hooks/useFullscreen'
import MainMenu from "./MainMenu"
import { MainViewer } from "./MainViewer"
import { useAppContext, wrapWithAppContext } from "./context"
import { CatalogDragAndDrop } from './features/catalog/CatalogDragAndDrop'
import { Dialogs } from './features/dialogs/Dialogs'
import { KeybindsProvider } from './keybindings/appKeybindings'
import { StateHistoryProvider } from './store/StateHistoryProvider'
import { useLocalStorageSync } from './store/stateSync/StorageSync'
import { useHashSync } from './store/stateSync/hashSync'
import styles from './style.module.scss'
import { AppProps } from './types'


const App = wrapWithAppContext(({
  hashSync = false,
  storageSync = false,
  catchAllKeyboardEvents = true,
  floatingLayerElement,
  floatingLayerZIndex,
}: AppProps) => {
  const { rootElementRef, store, stateHistory } = useAppContext()
  const { element: menuLayerElement, ref: menuLayer } = useElement<HTMLDivElement>()
  const { element: dialogLayerElement, ref: dialogLayer } = useElement<HTMLDivElement>()
  const { isFullscreen } = useIsFullscreen()

  useHashSync({ store, enabled: hashSync })
  useLocalStorageSync({ store, enabled: storageSync })

  return (
    <Provider store={store}>
      <div className={classNames(styles.main, styles.thema)} ref={rootElementRef} tabIndex={-1}>
        <DialogContext
          defaultPositionHint={defaultPositionHint}
          portal={isFullscreen && rootElementRef.current || dialogLayerElement}
        >
          <MenuProvider portal={isFullscreen && rootElementRef.current || menuLayerElement}>
            <StateHistoryProvider stateHistory={stateHistory}>
              <ModalProvider rootElementRef={rootElementRef}>
                <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
                  <CatalogDragAndDrop>
                    <MainViewer />
                    <MainMenu />
                  </CatalogDragAndDrop>
                  <Dialogs />
                </KeybindsProvider>
              </ModalProvider>
            </StateHistoryProvider>
          </MenuProvider>
        </DialogContext>
      </div>
      {createPortal((
        <div className={classNames(styles.thema, styles.floatingLayer)} style={{ zIndex: floatingLayerZIndex }} >
          <div ref={dialogLayer} />
          <div data-no-dnd ref={menuLayer} />
        </div>
      ), floatingLayerElement ?? document.body)}
    </Provider >
  )
})


export default App


const defaultPositionHint: CSSProperties = {
  top: 8,
  right: 8,
}


function useElement<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [element, setElement] = useState<T>()
  useEffect(() => {
    setElement(ref.current ?? undefined)
  }, [])
  return { element, ref }
}
