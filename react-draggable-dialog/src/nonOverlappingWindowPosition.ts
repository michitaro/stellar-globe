import { Position, Rect, Size } from "./types"

type nonOverlappingWindowPositionOptions = {
  margin?: number
  container?: Rect
  corners?: `${'top' | 'bottom'}${'Right' | 'Left'}`[]
}

export function nonOverlappingWindowPosition(
  rects: Rect[],
  size: Size,
  options: nonOverlappingWindowPositionOptions = {}
): Position {
  const {
    margin = 8,
    container = {
      top: margin,
      left: margin,
      width: window.innerWidth - 2 * margin,
      height: window.innerHeight - 2 * margin,
    },
    corners: containerCorners = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
  } = options

  // 画面の中心を計算
  const centerX = container.left + container.width / 2
  const centerY = container.top + container.height / 2

  let furthestPosition: Position | null = null
  let maxMinDistance = 0

  const updatePositionIfFurthest = (position: Position) => {
    const rect = { ...position, ...size }
    const corners = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y]) => ({
      x: rect.left + x * rect.width,
      y: rect.top + y * rect.height,
    }))

    // 4隅の中で最も近いものを見つける
    const minDistance = Math.min(...corners.map(corner =>
      (corner.x - centerX) ** 2 + (corner.y - centerY) ** 2
    ))

    if (minDistance > maxMinDistance) {
      maxMinDistance = minDistance
      furthestPosition = position
    }
  }

  // containerの四隅を探索
  const corners: Position[] = containerCorners.map(c => (
    {
      topLeft: { left: container.left, top: container.top },
      bottomLeft: { left: container.left, top: container.top + container.height - size.height },
      topRight: { left: container.left + container.width - size.width, top: container.top },
      bottomRight: { left: container.left + container.width - size.width, top: container.top + container.height - size.height },
    }[c]
  ))

  for (const corner of corners) {
    if (isValidPosition(corner, size, rects, margin, container)) {
      updatePositionIfFurthest(corner)
    }
  }

  // 既存のdialogsの隣接領域を探索
  for (const rect of rects) {
    const dialogRight = rect.left + rect.width
    const dialogBottom = rect.top + rect.height

    // 隣接する可能性のある位置を計算
    const adjacentPositions: Position[] = [
      // 右隣
      { left: dialogRight + margin, top: rect.top },
      { left: dialogRight + margin, top: dialogBottom - size.height },
      // 左隣
      { left: rect.left - size.width - margin, top: rect.top },
      { left: rect.left - size.width - margin, top: dialogBottom - size.height },
      // 上隣
      { left: rect.left, top: rect.top - size.height - margin },
      { left: rect.left + rect.width - size.width, top: rect.top - size.height - margin },
      // 下隣
      { left: rect.left, top: dialogBottom + margin },
      { left: rect.left + rect.width - size.width, top: dialogBottom + margin },
    ]

    for (const position of adjacentPositions) {
      if (isValidPosition(position, size, rects, margin, container)) {
        updatePositionIfFurthest(position)
      }
    }
  }

  return furthestPosition ?? fallback(rects, size, { margin, container })
}


function isValidPosition(newPosition: Position, size: Size, rects: Rect[], margin: number, container: Rect): boolean {
  // 新しい位置がcontainerの範囲内にあるか確認
  if (!(
    container.left <= newPosition.left &&
    newPosition.left + size.width <= container.left + container.width &&
    container.top <= newPosition.top &&
    newPosition.top + size.height <= container.top + container.height
  )) {
    return false
  }

  // newPositionが他のdialogsと重ならないかをチェック
  for (const rect of rects) {
    if (isOverlapping(newPosition, size, rect, margin)) {
      return false
    }
  }

  return true
}


function addMargin(rect: Rect, amount: number): Rect {
  // rectの各辺からamount分のマージンを引いた新しいRectを返す
  return {
    left: rect.left - amount,
    top: rect.top - amount,
    width: rect.width + 2 * amount,
    height: rect.height + 2 * amount
  }
}


function isOverlapping(pos1: Position, size1: Size, rect2: Rect, margin: number): boolean {
  // rect2にマージンを加える
  const enlargedRect2 = addMargin(rect2, margin)

  // pos1をRectに変換
  const rect1 = { left: pos1.left, top: pos1.top, width: size1.width, height: size1.height }

  // rect1と拡大されたrect2が重なっているかチェック
  return !(rect1.left + rect1.width <= enlargedRect2.left ||
    rect1.left >= enlargedRect2.left + enlargedRect2.width ||
    rect1.top + rect1.height <= enlargedRect2.top ||
    rect1.top >= enlargedRect2.top + enlargedRect2.height)
}


export function fallback(
  rects: Rect[],
  size: Size,
  options: { margin: number, container: Rect },
): Position {
  const { container, margin } = options

  for (let top = margin; top < Math.max(container.top, container.top + container.height - size.height); top += margin) {
    for (let left = margin; left < Math.max(container.left, container.left + container.width - size.width); left += margin) {
      if (!rects.some(r => Math.abs(left - r.left) < margin && Math.abs(top - r.top) < margin)) {
        return { left, top }
      }
    }
  }

  return fallback(rects, size, { margin: margin - 1, container })
}
