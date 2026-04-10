import { CSSProperties } from 'react'

export type ResizeHandleId = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export type DialogRect = {
  left: number
  top: number
  right: number
  bottom: number
}

type Viewport = {
  width: number
  height: number
}

const maxInsideOverlapRatio = 0.5

export function readDialogRect(element: HTMLElement | null): DialogRect | undefined {
  if (!element) {
    return
  }
  const { left, top, right, bottom } = element.getBoundingClientRect()
  return { left, top, right, bottom }
}

export function sameDialogRect(a: DialogRect | undefined, b: DialogRect | undefined) {
  if (!a || !b) {
    return a === b
  }
  return a.left === b.left
    && a.top === b.top
    && a.right === b.right
    && a.bottom === b.bottom
}

export function resizeHandleStyle({
  direction,
  dialogRect,
  gripSize = 8,
  viewport,
}: {
  direction: ResizeHandleId
  dialogRect: DialogRect
  gripSize?: number
  viewport?: Viewport
}): CSSProperties {
  const resolvedViewport = viewport ?? currentViewport(dialogRect)
  const n = direction.includes('n')
  const e = direction.includes('e')
  const s = direction.includes('s')
  const w = direction.includes('w')

  return {
    position: 'absolute',
    left: w ? -(gripSize - insideOverlap('w', dialogRect, gripSize, resolvedViewport)) : e ? undefined : gripSize,
    right: e ? -(gripSize - insideOverlap('e', dialogRect, gripSize, resolvedViewport)) : w ? undefined : gripSize,
    width: (e || w) ? gripSize : undefined,
    top: n ? -(gripSize - insideOverlap('n', dialogRect, gripSize, resolvedViewport)) : s ? undefined : gripSize,
    bottom: s ? -(gripSize - insideOverlap('s', dialogRect, gripSize, resolvedViewport)) : n ? undefined : gripSize,
    height: (n || s) ? gripSize : undefined,
    cursor: cursorForDirection(direction),
  }
}

function currentViewport(dialogRect: DialogRect): Viewport {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  return {
    width: dialogRect.right,
    height: dialogRect.bottom,
  }
}

function insideOverlap(
  edge: 'n' | 'e' | 's' | 'w',
  dialogRect: DialogRect,
  gripSize: number,
  viewport: Viewport,
) {
  const availableOutside = outsideSpace(edge, dialogRect, viewport)
  const requiredInside = Math.max(0, gripSize - availableOutside)
  const maxInsideOverlap = Math.floor(gripSize * maxInsideOverlapRatio)
  return Math.min(requiredInside, maxInsideOverlap)
}

function outsideSpace(
  edge: 'n' | 'e' | 's' | 'w',
  dialogRect: DialogRect,
  viewport: Viewport,
) {
  switch (edge) {
    case 'n':
      return Math.max(0, dialogRect.top)
    case 'e':
      return Math.max(0, viewport.width - dialogRect.right)
    case 's':
      return Math.max(0, viewport.height - dialogRect.bottom)
    case 'w':
      return Math.max(0, dialogRect.left)
  }
}

function cursorForDirection(direction: ResizeHandleId): CSSProperties['cursor'] {
  switch (direction) {
    case 'ne':
    case 'sw':
      return 'nesw-resize'
    case 'nw':
    case 'se':
      return 'nwse-resize'
    case 'n':
    case 's':
      return 'ns-resize'
    case 'e':
    case 'w':
      return 'ew-resize'
  }
}
