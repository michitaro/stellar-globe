import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styles from './styles.module.scss'


function useMakeContext() {
  const [count, setCount] = useState(0)
  const locked = count > 0
  const lock = useCallback(() => setCount(_ => _ + 1), [])
  const unlock = useCallback(() => setCount(_ => _ - 1), [])

  return useMemo(() => ({
    lock,
    unlock,
    locked,
  }), [lock, locked, unlock])
}


const Context = createContext<ReturnType<typeof useMakeContext> | undefined>(undefined)


export function BlockUIProvider({ children }: { children: ReactNode }) {
  const context = useMakeContext()
  const nodeRef = useRef(null)

  return (
    <Context.Provider value={context}>
      {children}
      <CSSTransition
        in={context.locked}
        timeout={{ enter: 100, exit: 200 }}
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
        <div ref={nodeRef} className={styles.block}>
          <progress />
        </div>
      </CSSTransition>
    </Context.Provider>
  )
}


export function useBlockUI() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`use of useBlockUI outside the provider`)
  }
  return context
}
