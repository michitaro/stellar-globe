import { DndContext, useDraggable } from '@dnd-kit/core'
import { DragMoveEvent } from "@dnd-kit/core/dist/types"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { ReactNode, RefObject, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DialogRect, readDialogRect, resizeHandleStyle, sameDialogRect } from './resizeHandleGeometry'
import { Origin, PartialSize, Position, Rect, Size } from './types'


type ResizableProps = {
  children: ReactNode
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
  size: PartialSize | undefined
  setSize: React.Dispatch<React.SetStateAction<PartialSize | undefined>>
  container: RefObject<HTMLElement | null>
  minSize?: Size
  enabled: { x: boolean, y: boolean }
  origin: Origin
}


const defaultMinSize = { width: 8, height: 8 } as const


export function Resizable(props: ResizableProps) {
  const { enabled } = props
  if (enabled.x || enabled.y) {
    return <EnabledResizable {...props} />
  }
  else {
    return props.children
  }
}


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

const xy2widthHeight = {
  x: 'width',
  y: 'height',
} as const

type DragState = {
  initialPosition: Rect
  direction: keyof typeof directions
}


function EnabledResizable({
  children,
  container,
  position,
  setPosition,
  size,
  setSize,
  minSize = defaultMinSize,
  enabled,
  origin,
}: ResizableProps) {
  const dragState = useRef<DragState | undefined>(undefined)
  const [containerRect, setContainerRect] = useState<DialogRect | undefined>(undefined)

  const onDragStart = useCallback((e: DragMoveEvent) => {
    const { left, top, width, height } = container.current!.getBoundingClientRect()
    dragState.current = {
      initialPosition: { left, top, width, height },
      direction: e.active.id as DragState['direction']
    }
  }, [container])

  const onDragEnd = useCallback(() => {
    dragState.current = undefined
  }, [])

  const onDragMove = useCallback((e: DragMoveEvent) => {
    const updateSize = (axis: 'x' | 'y', sign: number) => {
      const wh = xy2widthHeight[axis]
      const p0 = dragState.current!.initialPosition
      const newSize = Math.max(minSize[wh], p0[wh] + sign * e.delta[axis])
      setSize(size => {
        return {
          ...(size ?? {}),
          [wh]: newSize,
        }
      })
    }
    const dir = directions[e.active.id as keyof typeof directions]
    dir.x !== 0 && updateSize('x', dir.x)
    dir.y !== 0 && updateSize('y', dir.y)
  }, [minSize, setSize])

  useLayoutEffect(() => {
    // sizeの変更に基づいて位置を調整する。
    // render phaseではminmaxSize適用の結果が得られないので、ここで調整
    if (dragState.current) {
      const p0 = dragState.current.initialPosition
      const rect = container.current!.getBoundingClientRect()
      const { width, height } = rect
      let { left, top } = rect
      let right = window.innerWidth - rect.right
      let bottom = window.innerHeight - rect.bottom
      const dir = directions[dragState.current.direction]
      if (dir.x < 0 && origin.x === 'left') {
        left = p0.left - (width - p0.width)
      }
      if (dir.x > 0 && origin.x === 'right') {
        right = window.innerWidth - (p0.left + p0.width) - (width - p0.width)
      }
      if (dir.y < 0 && origin.y === 'top') {
        top = p0.top - (height - p0.height)
      }
      if (dir.y > 0 && origin.y === 'bottom') {
        bottom = window.innerHeight - (p0.top + p0.height) - (height - p0.height)
      }
      setPosition({
        [origin.x]: origin.x === 'left' ? left : right,
        [origin.y]: origin.y === 'top' ? top : bottom,
      } as Position)
    }
  }, [container, origin, setPosition, size])

  const updateContainerRect = useCallback(() => {
    setContainerRect(current => {
      const next = readDialogRect(container.current)
      return sameDialogRect(current, next) ? current : next
    })
  }, [container])

  useLayoutEffect(() => {
    const element = container.current
    if (!element) {
      setContainerRect(undefined)
      return
    }

    updateContainerRect()

    const resizeObserver = new ResizeObserver(updateContainerRect)
    resizeObserver.observe(element)
    window.addEventListener('resize', updateContainerRect)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContainerRect)
    }
  }, [container, updateContainerRect])

  useLayoutEffect(() => {
    updateContainerRect()
  }, [position, size, updateContainerRect])

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {children}
      {containerRect && enabled.y && <ResizeHandle dialogRect={containerRect} n />}
      {containerRect && enabled.y && enabled.x && <ResizeHandle dialogRect={containerRect} n e />}
      {containerRect && enabled.x && <ResizeHandle dialogRect={containerRect} e />}
      {containerRect && enabled.x && enabled.y && <ResizeHandle dialogRect={containerRect} e s />}
      {containerRect && enabled.y && <ResizeHandle dialogRect={containerRect} s />}
      {containerRect && enabled.y && enabled.x && <ResizeHandle dialogRect={containerRect} s w />}
      {containerRect && enabled.x && <ResizeHandle dialogRect={containerRect} w />}
      {containerRect && enabled.x && enabled.y && <ResizeHandle dialogRect={containerRect} w n />}
    </DndContext>
  )
}


type Direction = 'n' | 'e' | 'w' | 's'


function ResizeHandle({
  dialogRect,
  n,
  w,
  e,
  s,
  size = 8,
}: Partial<Record<Direction, boolean>> & { dialogRect: DialogRect, size?: number }) {
  const id = n ? (e ? 'ne' : w ? 'nw' : 'n') :
    s ? (e ? 'se' : w ? 'sw' : 's') :
      e ? 'e' : 'w'

  const { setNodeRef, listeners, attributes, } = useDraggable({
    id,
  })

  const style = useMemo(() => resizeHandleStyle({
    direction: id,
    dialogRect,
    gripSize: size,
  }), [dialogRect, id, size])

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} />
  )
}


// const id = (() => {
//   const map = new Map<unknown, number>()
//   return (obj: unknown) => {
//     if (!map.has(obj)) {
//       map.set(obj, map.size)
//     }
//     return map.get(obj)
//   }
// })()
