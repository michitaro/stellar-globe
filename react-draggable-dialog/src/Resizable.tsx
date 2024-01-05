import { DndContext, useDraggable } from '@dnd-kit/core'
import { DragMoveEvent } from "@dnd-kit/core/dist/types"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { CSSProperties, ReactNode, RefObject, useCallback, useMemo, useRef } from 'react'
import { Position, Size } from './types'


type ResizableProps = {
  children: ReactNode
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
  setSize: React.Dispatch<React.SetStateAction<Size | undefined>>
  container: RefObject<HTMLElement>
  minSize?: Size
}


const defaultMinSize = { width: 40, height: 40 } as const


export function Resizable({
  children,
  container,
  setPosition,
  setSize,
  minSize = defaultMinSize,
}: ResizableProps) {
  const positionAtDragStart = useRef<(Size & Position) | undefined>(undefined)

  const onDragStart = useCallback((e: DragMoveEvent) => {
    const { left, top, width, height } = container.current!.getBoundingClientRect()
    positionAtDragStart.current = { left, top, width, height }
  }, [container])

  const onDragMove = useCallback((e: DragMoveEvent) => {
    const xy2widthHeight = {
      x: 'width',
      y: 'height',
    } as const

    const xy2leftTop = {
      x: 'left',
      y: 'top',
    } as const

    const directions = {
      n: { x: 0, y: -1 },
      e: { x: 1, y: 0 },
      s: { x: 0, y: 1 },
      w: { x: -1, y: 0 },
      ne: { x: 1, y: -1 },
      nw: { x: -1, y: -1 },
      se: { x: 1, y: 1 },
      sw: { x: -1, y: 1 },
    } as const

    const updateSize = (axis: 'x' | 'y', sign: number) => {
      const wh = xy2widthHeight[axis]
      const min = minSize[wh]
      const { width, height } = positionAtDragStart.current!

      setSize(size => {
        console.log({
          ...(size ?? { width, height }),
          [wh]: Math.max(min, positionAtDragStart.current![wh] + sign * e.delta[axis]),
        })
        return {
          ...(size ?? { width, height }),
          [wh]: Math.max(min, positionAtDragStart.current![wh] + sign * e.delta[axis]),
        }
      })
    }

    const updateCoordinates = (axis: 'x' | 'y', sign: number) => {
      const wh = xy2widthHeight[axis]
      const leftTop = xy2leftTop[axis]
      const p0 = positionAtDragStart.current!
      const max = p0[leftTop] + p0[wh] - minSize[wh]
      setPosition(_ => _ && ({
        ..._,
        [leftTop]: Math.min(max, positionAtDragStart.current![leftTop] + sign * e.delta[axis]),
      }))
    }

    const dir = directions[e.active.id as keyof typeof directions]
    if (dir) {
      updateSize('x', dir.x)
      updateSize('y', dir.y)
      dir.x < 0 && updateCoordinates('x', 1)
      dir.y < 0 && updateCoordinates('y', 1)
    }
  }, [minSize, setPosition, setSize])

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      modifiers={[restrictToWindowEdges]}
    >
      {children}
      <ResizeHandle n />
      <ResizeHandle n e />
      <ResizeHandle e />
      <ResizeHandle e s />
      <ResizeHandle s />
      <ResizeHandle s w />
      <ResizeHandle w />
      <ResizeHandle w n />
    </DndContext>
  )
}


type Direction = 'n' | 'e' | 'w' | 's'


function ResizeHandle({ n, w, e, s, size = 8 }: Partial<Record<Direction, boolean>> & { size?: number }) {
  const boxPosition = useMemo<CSSProperties>(() => ({
    // backgroundColor: 'rgba(0, 255, 0, 0.25)',
    position: 'absolute',
    left: w ? `${-size}px` : e ? undefined : `${size}px`,
    right: e ? `${-size}px` : w ? undefined : `${size}px`,
    width: (e || w) ? `${2 * size}px` : undefined,
    top: n ? `${-size}px` : s ? undefined : `${size}px`,
    bottom: s ? `${-size}px` : n ? undefined : `${size}px`,
    height: (n || s) ? `${2 * size}px` : undefined,
    cursor: (n && e || s && w) ? 'nesw-resize' :
      (n && w || s && e) ? 'nwse-resize' :
        (n || s) ? 'ns-resize' :
          (e || w) ? 'ew-resize' : undefined,
  }), [e, n, s, size, w])

  const id = n ? (e ? 'ne' : w ? 'nw' : 'n') :
    s ? (e ? 'se' : w ? 'sw' : 's') :
      e ? 'e' : 'w'

  const { setNodeRef, listeners, attributes, } = useDraggable({
    id,
  })

  const style = {
    ...boxPosition,
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} />
  )
}
