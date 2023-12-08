import { useLayerBind } from "@stellar-globe/react-stellar-globe"
import { Globe, GlobePointerDragEvent, GlobePointerEvent, Layer, MousePicker, SkyCoord } from "@stellar-globe/stellar-globe"
import { useCallback } from "react"


type Callbacks = {
  onDrag: (start: SkyCoord, end: SkyCoord) => void
  onUp: (start: SkyCoord, end: SkyCoord) => void
}


class DragAndUpLayer extends Layer {
  constructor(
    globe: Globe,
    callbacks: Callbacks,
  ) {
    super(globe)
    this.mousePickers.push(new DragAndUpMousePicker(callbacks))
  }
}


class DragAndUpMousePicker extends MousePicker {
  constructor(
    readonly callbacks: Callbacks,
  ) {
    super()
  }

  hit(e: GlobePointerEvent): { hit: boolean; passThrough: boolean } {
    return { hit: true, passThrough: false }
  }

  protected onDrag(e: GlobePointerDragEvent): void {
    this.callbacks.onDrag(e.downEvent.coord, e.coord)
  }

  protected onPointerUp(e: GlobePointerDragEvent): void {
    this.callbacks.onUp(e.downEvent.coord, e.coord)
  }
}


type Props = {
  enabled: boolean
} & Callbacks


export function PointerDragAndUpLayer$({ enabled, onDrag, onUp }: Props) {
  const factory = useCallback((globe: Globe) => new DragAndUpLayer(globe, { onDrag, onUp }), [onDrag, onUp])
  const { node } = useLayerBind(factory, enabled)
  return node
}
