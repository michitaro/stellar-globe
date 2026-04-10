import { describe, expect, it } from 'vitest'
import { resizeHandleStyle } from '../src/resizeHandleGeometry'

describe('resizeHandleStyle', () => {
  const viewport = { width: 1200, height: 800 }

  it('places side handles fully outside the dialog when there is enough room', () => {
    const style = resizeHandleStyle({
      direction: 'e',
      dialogRect: { left: 200, top: 120, right: 600, bottom: 520 },
      gripSize: 8,
      viewport,
    })

    expect(style.right).toBe(-8)
    expect(style.width).toBe(8)
    expect(style.top).toBe(8)
    expect(style.bottom).toBe(8)
  })

  it('limits inside overlap when the dialog touches the viewport edge', () => {
    const style = resizeHandleStyle({
      direction: 'e',
      dialogRect: { left: 600, top: 120, right: 1200, bottom: 520 },
      gripSize: 8,
      viewport,
    })

    expect(style.right).toBe(-4)
    expect(style.width).toBe(8)
  })

  it('keeps horizontal edge handles outside when there is enough room', () => {
    const style = resizeHandleStyle({
      direction: 's',
      dialogRect: { left: 200, top: 120, right: 600, bottom: 520 },
      gripSize: 8,
      viewport,
    })

    expect(style.bottom).toBe(-8)
    expect(style.height).toBe(8)
    expect(style.left).toBe(8)
    expect(style.right).toBe(8)
  })

  it('falls back inward on both axes for a corner handle at the viewport edge', () => {
    const style = resizeHandleStyle({
      direction: 'se',
      dialogRect: { left: 600, top: 300, right: 1200, bottom: 800 },
      gripSize: 8,
      viewport,
    })

    expect(style.right).toBe(-4)
    expect(style.bottom).toBe(-4)
    expect(style.width).toBe(8)
    expect(style.height).toBe(8)
    expect(style.cursor).toBe('nwse-resize')
  })
})
