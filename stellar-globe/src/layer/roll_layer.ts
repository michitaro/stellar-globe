import { Inertia2D } from "@stellar-globe/inertia"
import { Globe } from "~/globe"
import { AnimationCallback } from "~/globe/animation"
import { mouse } from '~/utils/mouse'
import { GlobePointerEvent } from "./GlobePointerEvent"
import { Layer } from "./layer"
import { InertiaMousePicker } from "./layer/MousePicker"


class RollMousePicker extends InertiaMousePicker {
  hit(e: GlobePointerEvent) {
    return {
      passThrough: false,
      hit: e.originalEvent({
        mouse: me => mouse.button(me) === mouse.Button.MIDDLE,
      }) ?? false
    }
  }

  private offset = { x: NaN, y: NaN }

  protected onInertialPointerDown(e: GlobePointerEvent): void {
    this.offset.x = e.clientX
    this.offset.y = e.clientY
  }

  protected onInertiaMove({ dt }: AnimationCallback): void {
    let { position: { x, y }, velocity: { x: vx, y: vy } } = this.inertia.state
    x += this.offset.x
    y += this.offset.y
    const dx = dt * vx
    const dy = dt * vy
    const canvas = this.globe.canvas
    x -= canvas.domElement.clientWidth / 2
    y -= canvas.domElement.clientHeight / 2
    if (x !== 0 && y !== 0) {
      this.globe.camera.roll += (y * dx - x * dy) / (x * x + y * y)
    }
  }
}


export class RollLayer extends Layer {
  constructor(
    globe: Globe,
  ) {
    super(globe)
    this.mousePickers.push(new RollMousePicker(globe, new Inertia2D()))
  }
}
