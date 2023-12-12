import { useLayerBind } from "@stellar-globe/react-stellar-globe"
import { Globe, GlobePointerDragEvent, Layer, SkyCoord, makePointingObject } from "@stellar-globe/stellar-globe"
import { useCallback } from "react"


type Callbacks = {
  onDrag: (e: GlobePointerDragEvent) => void
  onUp: (e: GlobePointerDragEvent) => void
}


class PointerDragLayer extends Layer {
  constructor(
    globe: Globe,
    callbacks: Callbacks,
  ) {
    super(globe)
    this.pointingObjects.push(
      makePointingObject({
        hit() {
          return { hit: true }
        },
        hoverIcon: 'crosshair',
        dragIcon: 'crosshair',
        onPointerDown(downEvent) {
          return {
            onDrag(dragEvent) {
              callbacks.onDrag(dragEvent)
            },
            onPointerUp(upEvent) {
              callbacks.onUp(upEvent)
            },
          }
        },
      }),
    )
  }
}


type Props = {
  enabled: boolean
} & Callbacks


export function PointerDragAndUpLayer$({ enabled, onDrag, onUp }: Props) {
  const factory = useCallback((globe: Globe) => new PointerDragLayer(globe, { onDrag, onUp }), [onDrag, onUp])
  const { node } = useLayerBind(factory, enabled)
  return node
}
