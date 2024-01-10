import { ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useRef, useState } from "react"


function useMakeContext(containerRef: RefObject<HTMLElement>) {
  const [container, setContainer] = useState<HTMLElement>()

  useEffect(() => {
    setContainer(containerRef.current!)
  }, [containerRef])

  return useMemo(() => ({
    container,
  }), [container])
}


const Context = createContext<ReturnType<typeof useMakeContext> | undefined>(undefined)


type ProviderProps = {
  children: ReactNode
  containerRef: RefObject<HTMLElement>
}


export function MenuProvider({ children, containerRef }: ProviderProps) {
  const context = useMakeContext(containerRef)
  return <Context.Provider value={context}>{children}</Context.Provider>
}


export function useMenuContainer() {
  const context = useContext(Context)
  return context?.container
}
