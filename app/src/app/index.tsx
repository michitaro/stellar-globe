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
        <MenuContainer containerRef={rootElementRef}>
          <StateHistoryProvider stateHistory={stateHistory}>
            <ModalProvider rootElementRef={rootElementRef}>
              <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
                <CatalogDragAndDrop>
                  <MainViewer />
                  <Panels />
                  <MainMenu />
                </CatalogDragAndDrop>
              </KeybindsProvider>
            </ModalProvider>
          </StateHistoryProvider>
        </MenuContainer>
      </div>
    </Provider >
  )
})


export default App
