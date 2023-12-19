import { GlobeHandle } from "@stellar-globe/react-stellar-globe"
import { createContext, useContext, useMemo, useRef } from "react"


function useMakeContext() {
  const globeHandle = useRef<GlobeHandle>(null)
  const rootElementRef = useRef<HTMLDivElement>(null)

  return useMemo(() => ({
    rootElementRef,
    globeHandle,
  }), [])
}


const AppContext = createContext<undefined | ReturnType<typeof useMakeContext>>(undefined)


export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error(`use of useMiniAppContext outside the provider`)
  }
  return context
}


export function wrapWithAppContext<T>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T) {
    const context = useMakeContext()
    return (
      <AppContext.Provider value={context}>
        {/* @ts-ignore */}
        <Component {...props} />
      </AppContext.Provider>
    )
  }
}
