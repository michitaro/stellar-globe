import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/theme-dark.css'
import 'material-symbols'
import { useEffect } from "react"
import { Provider } from "react-redux"
import { useInstanceVariable } from '../hooks/useInstanceVaribale'
import MainMenu from "./MainMenu"
import { MainViewer } from "./MainViewer"
import { Panels } from "./Panels"
import { useAppContext, wrapWithAppContext } from "./context"
import { KeybindsProvider } from './keybindings'
import { makeStore } from "./store"
import { enableHashSync } from './store/hashSync'
import styles from './style.module.scss'


type Props = {
  hashSync?: boolean
  catchAllKeyboardEvents?: boolean
}


const App = wrapWithAppContext(({
  hashSync = false,
  catchAllKeyboardEvents = false,
}: Props) => {
  const store = useInstanceVariable(makeStore)
  const { rootElementRef } = useAppContext()

  useEffect(() => {
    if (hashSync) {
      return enableHashSync(store)
    }
  }, [hashSync, store])

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
