import '@stellar-globe/react-draggable-dialog/style.css'
import '@szhsin/react-menu/dist/index.css'
import 'material-symbols/outlined.css'
import { Provider } from "react-redux"
import { ModalProvider } from '../common/components/Modal'
import MainMenu from "./MainMenu"
import { MainViewer } from "./MainViewer"
import { Panels } from "./Panels"
import { useAppContext, wrapWithAppContext } from "./context"
import { CatalogDragAndDrop } from './features/catalog/CatalogDragAndDrop'
import { KeybindsProvider } from './keybindings/appKeybindings'
import { StateHistoryProvider } from './store/StateHistoryProvider'
import { useLocalStorageSync } from './store/stateSync/StorageSync'
import { useHashSync } from './store/stateSync/hashSync'
import styles from './style.module.scss'
import { AppProps } from './types'
import { MenuContainer } from '../common/components/Menu/MenuContext'
import { DarkDialog, DialogContext } from '@stellar-globe/react-draggable-dialog'
import { Dialogs } from './features/dialogs/Dialogs'



const App = wrapWithAppContext(({
  hashSync = false,
  storageSync = false,
  catchAllKeyboardEvents = true,
}: AppProps) => {
  const { rootElementRef, store, stateHistory } = useAppContext()
  useHashSync({ store, enabled: hashSync })
  useLocalStorageSync({ store, enabled: storageSync })
  return (
    <Provider store={store}>
      <div className={styles.main} ref={rootElementRef} tabIndex={-1}>
        <DialogContext>
          <MenuContainer containerRef={rootElementRef}>
            <StateHistoryProvider stateHistory={stateHistory}>
              <ModalProvider rootElementRef={rootElementRef}>
                <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
                  <CatalogDragAndDrop>
                    <MainViewer />
                    <Panels />
                    <MainMenu />
                  </CatalogDragAndDrop>
                  <Dialogs />
                </KeybindsProvider>
              </ModalProvider>
            </StateHistoryProvider>
          </MenuContainer>
        </DialogContext>
      </div>
    </Provider >
  )
})


export default App
