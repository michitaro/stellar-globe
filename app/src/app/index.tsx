import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/theme-dark.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import 'material-symbols'
import { Provider } from "react-redux"
import { useInstanceVariable } from '../common/hooks/useInstanceVaribale'
import MainMenu from "./MainMenu"
import { MainViewer } from "./MainViewer"
import { Panels } from "./Panels"
import { useAppContext, wrapWithAppContext } from "./context"
import { KeybindsProvider } from './keybindings/appKeybindings'
import { makeStore } from "./store"
import { StateHistoryProvider } from './store/StateHistoryProvider'
import { useLocalStorageSync } from './store/stateSync/StorageSync'
import { useHashSync } from './store/stateSync/hashSync'
import styles from './style.module.scss'


type Props = {
  hashSync?: boolean
  storageSync?: boolean
  catchAllKeyboardEvents?: boolean
}


const App = wrapWithAppContext(({
  hashSync = false,
  storageSync = false,
  catchAllKeyboardEvents = false,
}: Props) => {
  const { store, stateHistory } = useInstanceVariable(makeStore)
  const { rootElementRef } = useAppContext()
  useHashSync({ store, enabled: hashSync })
  useLocalStorageSync({ store, enabled: storageSync })
  
  return (
    <Provider store={store}>
      <StateHistoryProvider stateHistory={stateHistory}>
        <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
          <div className={styles.main} ref={rootElementRef} tabIndex={-1}>
            <MainViewer />
            <Panels />
            <MainMenu />
          </div>
        </KeybindsProvider>
      </StateHistoryProvider>
    </Provider>
  )
})


export default App
