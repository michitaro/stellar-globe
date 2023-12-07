import { Globe } from "~/globe"
import { GlobePointerDragEvent, GlobePointerEvent } from "~/layer/GlobePointerEvent"
import { ReleaseCallbacks } from "~/utils/EventManager"
import { SinglePointerEvent } from "~/utils/SinglePointerEvent"
import { isClick } from "~/utils/event"
import { MousePicker } from ".."



export function PointerEventManager(
  globe: Globe,
) {
  const releaseCallbacks = ReleaseCallbacks()
  const domElement = globe.canvas.domElement
  let pointerPressed = false
  const view = () => globe.camera.view()

  const offDown = SinglePointerEvent.onDown(domElement, downSe => {
    // マウス押下中・・・
    const activeMousePickers: MousePicker[] = []
    const downGe = new GlobePointerEvent(downSe, globe, view())
    pointerPressed = true

    layerLoop:
    for (let i = globe.layers.length - 1; i >= 0; --i) {
      const layer = globe.layers[i]
      for (let j = layer.mousePickers.length - 1; j >= 0; --j) {
        const mousePicker = layer.mousePickers[j]
        const { hit, passThrough } = mousePicker.hit(downGe)
        if (hit) {
          activeMousePickers.push(mousePicker)
          mousePicker.runOnPointerDown(downGe)
          if (!passThrough || downGe.stopped) {
            break layerLoop
          }
        }
      }
    }

    const offDrag = SinglePointerEvent.onMove(document, moveEvent => {
      const v = view()
      for (const mp of activeMousePickers) {
        mp.runOnDrag(new GlobePointerDragEvent(moveEvent, globe, v, downGe))
      }
    })

    const offUp = SinglePointerEvent.onUp(document, upSe => {
      offUp()
      offDrag()
      pointerPressed = false
      const v = view()
      const dragGe = new GlobePointerDragEvent(upSe, globe, v, downGe)
      const upGe = new GlobePointerEvent(upSe, globe, v)
      for (const mp of activeMousePickers) {
        mp.runOnPointerUp(dragGe)
      }
      if (isClick(downSe, upSe)) {
        for (const mp of activeMousePickers) {
          mp.runOnClick(upGe)
          if (upGe.stopped) {
            break
          }
        }
      }
      globe.emit('pointer-up', upGe)
    })

    globe.emit('pointer-down', downGe)
    // マウス押下中おわり
  })
  releaseCallbacks.add(offDown)


  const checkHover = (e: GlobePointerEvent) => {
    for (let i = globe.layers.length - 1; i >= 0; --i) {
      const l = globe.layers[i]
      for (const m of l.mousePickers) {
        m.runOnMove(e)
        if (!pointerPressed) {
          m.runHover(e)
        }
      }
    }
  }
  let lastMoveEvent: GlobePointerEvent | undefined

  const offMove = SinglePointerEvent.onMove(domElement, (se: SinglePointerEvent) => {
    globe.emit('pointer-move', new GlobePointerEvent(se, globe, view()))
    const e = new GlobePointerEvent(se, globe, view())
    checkHover(e)
    lastMoveEvent = e
  })
  releaseCallbacks.add(offMove)

  releaseCallbacks.add(globe.on('layer-change', () => {
    lastMoveEvent && checkHover(lastMoveEvent)
  }))

  return releaseCallbacks.flush
}
