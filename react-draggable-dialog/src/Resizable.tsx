import { DndContext, useDraggable } from '@dnd-kit/core'
import { DragMoveEvent } from "@dnd-kit/core/dist/types"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { CSSProperties, ReactNode, RefObject, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { Position, Size } from './types'


type ResizableProps = {
  children: ReactNode
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
  size: Size | undefined
  setSize: React.Dispatch<React.SetStateAction<Size | undefined>>
  container: RefObject<HTMLElement>
  minSize?: Size
}


const defaultMinSize = { width: 8, height: 8 } as const


export function Resizable({ enabled, ...props }: ResizableProps & { enabled: boolean }) {
  if (enabled) {
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
  initialPosition: Size & Position
  direction: keyof typeof directions
}


function EnabledResizable({
  children,
  container,
  setPosition,
  size,
  setSize,
  minSize = defaultMinSize,
}: ResizableProps) {
  // const positionAtDragStart = useRef<(Size & Position) | undefined>(undefined)
  const dragState = useRef<DragState | undefined>()

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
      const { width, height } = p0
      setSize(size => {
        return {
          ...(size ?? { width, height }),
          [wh]: newSize,
        }
      })
    }
    const dir = directions[e.active.id as keyof typeof directions]
    updateSize('x', dir.x)
    updateSize('y', dir.y)
  }, [minSize, setSize])

  useLayoutEffect(() => {
    // sizeの変更に基づいて位置を調整する。
    // n, wのハンドルで大きさが変わった場合、変化の分だけleft, topを調整する必要がある
    // render phaseではminmaxSize適用の結果が得られないので、ここで調整
    if (dragState.current) {
      const p0 = dragState.current.initialPosition
      const rect = container.current!.getBoundingClientRect()
      let { left, top } = rect
      const { width, height } = rect
      const dir = directions[dragState.current.direction]
      if (dir.x < 0) {
        left = p0.left - (width - p0.width)
      }
      if (dir.y < 0) {
        top = p0.top - (height - p0.height)
      }
      setPosition({ left, top })
    }
  }, [container, setPosition, size])

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
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
