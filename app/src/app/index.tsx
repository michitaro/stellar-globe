import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/theme-dark.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import 'material-symbols'
import { Provider } from "react-redux"
import { BlockUIProvider } from '../common/components/BlockUI'
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
      <StateHistoryProvider stateHistory={stateHistory}>
        <BlockUIProvider>
          <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
            <div className={styles.main} ref={rootElementRef} tabIndex={-1}>
              <CatalogDragAndDrop>
                <MainViewer />
                <Panels />
                <MainMenu />
              </CatalogDragAndDrop>
            </div>
          </KeybindsProvider>
        </BlockUIProvider>
      </StateHistoryProvider>
    </Provider>
  )
})


export default App
