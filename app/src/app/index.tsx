import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/theme-dark.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import 'material-symbols'
import { Provider } from "react-redux"
import { useInstanceVariable } from '../hooks/useInstanceVaribale'
import MainMenu from "./MainMenu"
import { MainViewer } from "./MainViewer"
import { Panels } from "./Panels"
import { useAppContext, wrapWithAppContext } from "./context"
import { KeybindsProvider } from './keybindings'
import { makeStore } from "./store"
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
  const store = useInstanceVariable(makeStore)
  const { rootElementRef } = useAppContext()
  useHashSync({ store, enabled: hashSync })
  useLocalStorageSync({ store, enabled: storageSync })

  return (
    <Provider store={store}>
      <KeybindsProvider containerRef={rootElementRef} catchAllEvents={catchAllKeyboardEvents}>
        <div className={styles.main} ref={rootElementRef} tabIndex={-1}>
          <MainViewer />
          <Panels />
          <MainMenu />
        </div>
      </KeybindsProvider>
    </Provider>
  )
})


export default App
