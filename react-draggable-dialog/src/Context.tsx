import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useInstanceVariable } from "./hooks"
import { defaultPositionFinder } from "./positionFinder/defaultPositionFinder"
import { Position, Rect, Size } from "./types"


export type DialogState = {
  rect: Rect
  visible: boolean
}


type ContextType = {
  portal?: HTMLElement
  dialogs: Map<number, DialogState>
  nextPosition: (size: Size, options: { positionHint?: Position }) => Position
  zIndex: Map<number, number>
  raiseWindow: (id: number) => void
}


const Context = createContext<ContextType | undefined>(undefined)


type Props = {
  children: ReactNode
  portal?: HTMLElement
  positionFinder?: (rects: Rect[], size: Size, options: { positionHint?: Position }) => Position
}


export function DialogContext({
  children,
  portal,
  positionFinder = defaultPositionFinder,
}: Props) {
  const dialogs = useInstanceVariable(() => new Map<number, DialogState>())
  const [zIndex, setZIndex] = useState(new Map<number, number>())

  const raiseWindow = useCallback((id0: number) => {
    const z0 = zIndex.get(id0)!
    setZIndex(zIndex => new Map(function* () {
      for (const [id, z] of zIndex) {
        yield [id, z === z0 ? zIndex.size - 1 : z < z0 ? z : z - 1]
      }
    }()))
  }, [zIndex])

  const context: ContextType = useMemo(() => ({
    dialogs,
    portal,
    nextPosition: (size: Size, options: { positionHint?: Position }) => positionFinder(
      [...dialogs.values()].filter(d => d.visible).map(d => d.rect),
      size,
      { positionHint: options.positionHint },
    ),
    zIndex,
    raiseWindow,
  }), [dialogs, portal, positionFinder, raiseWindow, zIndex])

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}


export function useDialogContext() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`Use of useDialogContext outside its provider`)
  }
  return context
}


export function useZIndex(id: number) {
  const { zIndex } = useDialogContext()
  if (!zIndex.has(id)) {
    zIndex.set(id, zIndex.size)
  }
  useEffect(() => {
    return () => {
      zIndex.delete(id)
    }
  }, [id, zIndex])
  return zIndex.get(id)!
}
