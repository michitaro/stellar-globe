import { useLayerBind } from "@stellar-globe/react-stellar-globe"
import { Globe, GlobePointerDragEvent, GlobePointerEvent, Layer, makePointingObject } from "@stellar-globe/stellar-globe"
import { useCallback } from "react"


type Callbacks = {
  onDrag?: (e: GlobePointerDragEvent) => void
  onUp?: (e: GlobePointerDragEvent) => void
  onClick?: (e: GlobePointerEvent) => void
}


class PointerLayer extends Layer {
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
              callbacks.onDrag?.(dragEvent)
            },
            onPointerUp(upEvent) {
              callbacks.onUp?.(upEvent)
            },
          }
        },
        onClick: e => {
          callbacks.onClick?.(e)
        }
      }),
    )
  }
}


type Props = {
  enabled?: boolean
} & Callbacks


export function PointeLayer$({ enabled = true, onDrag, onUp, onClick }: Props) {
  const factory = useCallback(
    (globe: Globe) => new PointerLayer(globe, { onDrag, onUp, onClick }),
    [onDrag, onUp, onClick],
  )
  const { node } = useLayerBind(factory, enabled)
  return node
}
