import { useLayerBind } from "@stellar-globe/react-stellar-globe"
import { path, Globe, GlobePointerDragEvent, GlobePointerEvent, GlobeStoppablePointerEvent, Layer, MousePicker, View, SkyCoord, V3 } from "@stellar-globe/stellar-globe"
import { useCallback, useEffect } from "react"

class NewLinearRegionLayer extends Layer {
  private pathRenderer: path.Renderer
  private released = false

  constructor(globe: Globe) {
    super(globe)
    this.pathRenderer = new path.Renderer(globe.gl, { darkenNarrowLine: false, blendMode: 'NORMAL', minWidth: 3 })
    this.onRelease(() => {
      this.released = true
      this.pathRenderer.release()
    })
    this.mousePickers.push(new NewLinearRegionLayerMousePicker(this.setLine.bind(this)))
  }

  protected onAddToGlobe(): void {
    this.onRemoveFromGlobe(() => {
    })
  }

  private setLine(a: SkyCoord, b: SkyCoord) {
    const div = 5 * Math.ceil(a.angle(b).deg)

    this.pathRenderer.setPaths([
      {
        close: false,
        joint: 'NONE',
        points: Array.from({ length: div + 1 }, (_, i) => ({
          color: [1, 0, 1, 1],
          position: interpolate(a.xyz, b.xyz, i / div),
          size: 0,
        })),
      },
    ])
    this.globe.requestRefresh()
  }


  render(view: View): void {
    this.pathRenderer.render(view, 1)
  }
}


class NewLinearRegionLayerMousePicker extends MousePicker {
  constructor(
    private setLine: (a: SkyCoord, b: SkyCoord) => void,
  ) {
    super()
  }

  hit(e: GlobePointerEvent): { hit: boolean; passThrough: boolean } {
    return { hit: true, passThrough: false }
  }

  // protected onPointerDown(e: GlobeStoppablePointerEvent): void {
  //   e
  // }

  protected onDrag(e: GlobePointerDragEvent): void {
    this.setLine(
      e.downEvent.coord,
      e.coord,
    )
  }

  // protected onPointerUp(e: GlobePointerEvent): void {
  //   e
  // }
}


type Props = {
  enabled: boolean
}


export function NewLinearRegionLayer$({ enabled }: Props) {
  // const factory = useCallback((globe: Globe) => new NewLinearRegionLayer(globe), [])
  const factory = (globe: Globe) => {
    const layer = new NewLinearRegionLayer(globe)
    return layer
  }
  const { node } = useLayerBind(factory, enabled)

  return node
}


function interpolate(p0: V3, p1: V3, t: number): V3 {
  const m: V3 = [
    t * p0[0] + (1 - t) * p1[0],
    t * p0[1] + (1 - t) * p1[1],
    t * p0[2] + (1 - t) * p1[2],
  ]
  const r = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2])
  if (r === 0) {
    return p0
  }
  return [
    m[0] / r,
    m[1] / r,
    m[2] / r,
  ]
}
