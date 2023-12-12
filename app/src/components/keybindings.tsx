import { ReactNode, RefObject, createContext, useContext, useEffect, useMemo } from "react"
import { generateShortcutFromEvent, normalizeShortcut } from "../utils/keybindings"


function useMakeContext({
  containerRef,
  keybinds,
  catchAllEvents,
}: {
  containerRef: RefObject<HTMLElement>
  keybinds: { [shortcut: string]: Keybind }
  catchAllEvents: boolean,
}) {
  const shortcutMap = useMemo(() => {
    return new Map(Object.entries(keybinds).map(([_, { action, shortcut }]) => [normalizeShortcut(shortcut), action]))
  }, [keybinds])

  useEffect(function setupEventListener() {
    const cb = (e: KeyboardEvent) => {
      if (catchAllEvents || e.target instanceof Node && containerRef.current?.contains(e.target)) {
        const shortcut = generateShortcutFromEvent(e)
        const kb = shortcutMap.get(shortcut)
        if (kb) {
          e.preventDefault()
          kb()
        }
      }
    }
    document.addEventListener('keydown', cb)
    return () => {
      document.removeEventListener('keydown', cb)
    }
  }, [catchAllEvents, containerRef, keybinds, shortcutMap])

  return useMemo(() => ({
    keybinds,
  }), [keybinds])
}
const Context = createContext<ReturnType<typeof useMakeContext> | undefined>(undefined)
export type Keybind = {
  shortcut: string
  action: () => void
}


export function makeKeybindsEnvironment<T extends Record<string, Keybind>>(
  useKeybinds: () => T,
) {
  type ProviderProps = {
    children?: ReactNode
    containerRef: RefObject<HTMLElement>
    catchAllEvents?: boolean
  }

  const KeybindsProvider = ({
    children, containerRef,
    catchAllEvents = false,
  }: ProviderProps) => {
    const keybinds = useKeybinds()
    const context = useMakeContext({ containerRef, keybinds, catchAllEvents })
    return (
      <Context.Provider value={context}>
        {children}
      </Context.Provider>
    )
  }

  const useKeybind = (which?: keyof T) => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`use of useKeybinds outside its provider`)
    }
    return which && (context.keybinds as T)[which]
  }

  const useKeybindShortcut = (which?: keyof T) => {
    return useKeybind(which)?.shortcut
  }

  const useKeybindAction = (which?: keyof T) => {
    return useKeybind(which)?.action
  }

  return { KeybindsProvider, useKeybindShortcut, useKeybindAction }
}
