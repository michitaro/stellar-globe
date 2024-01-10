import { DialogContext } from '@stellar-globe/react-draggable-dialog'
import '@stellar-globe/react-draggable-dialog/style.css'
import '@szhsin/react-menu/dist/index.css'
import 'material-symbols/outlined.css'
import { CSSProperties, RefObject, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Provider } from "react-redux"
import { MenuProvider } from '../common/components/Menu/MenuContext'
import { ModalProvider } from '../common/components/Modal'
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
import classNames from 'classnames'


const App = wrapWithAppContext(({
  hashSync = false,
  storageSync = false,
  catchAllKeyboardEvents = true,
  floatingLayerElement,
}: AppProps) => {
  const { rootElementRef, store, stateHistory } = useAppContext()
  const menuLayer = useRef<HTMLDivElement>(null)
  const menuLayerElement = useUnwrapElement(menuLayer)
  const dialogLayer = useRef<HTMLDivElement>(null)
  const dialogLayerElement = useUnwrapElement(dialogLayer)
  useHashSync({ store, enabled: hashSync })
  useLocalStorageSync({ store, enabled: storageSync })

  return (
    <Provider store={store}>
      <div className={classNames(styles.main, styles.thema)} ref={rootElementRef} tabIndex={-1}>
        <DialogContext
          defaultPositionHint={defaultPositionHint}
          portal={dialogLayerElement}
        >
          <MenuProvider containerRef={menuLayer}>
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
        <div className={classNames(styles.thema, styles.floatingLayer)} >
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


function useUnwrapElement<T>(ref: RefObject<T>) {
  const [payload, setPayload] = useState<T | undefined>()
  useEffect(() => {
    setPayload(ref.current ?? undefined)
  }, [ref])
  return payload
}
