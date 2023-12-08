import { Inertia2D } from "@stellar-globe/inertia"
import { Globe } from "~/globe"
import { Animation, AnimationCallback } from "~/globe/animation"
import { GlobePointerDragEvent, GlobePointerEvent } from "~/layer/GlobePointerEvent"


type HitResult = {
  hit: boolean
  passThrough: boolean
}


export abstract class MousePicker {
  abstract hit(e: GlobePointerEvent): HitResult
  protected onPointerDown(e: GlobePointerEvent) { e }
  protected onDrag(e: GlobePointerDragEvent) { e }
  protected onPointerUp(e: GlobePointerDragEvent) { e }
  protected onClick(e: GlobePointerEvent) { e }
  protected onMove(e: GlobePointerEvent) { e }
  protected onHover(e: GlobePointerEvent) { e }
  protected onEnter(e: GlobePointerEvent) { e }
  protected onLeave(e: GlobePointerEvent) { e }
  private hovering = false;

  /** @internal */
  runHover(e: GlobePointerEvent) {
    const { hit } = this.hit(e)
    this.onHover(e)
    if (this.hovering !== hit) {
      this.hovering = hit
      if (hit) {
        this.onEnter(e)
      } else {
        this.onLeave(e)
      }
    }
  }

  /** @internal */
  runOnMove(...args: Parameters<MousePicker["onMove"]>) { return this.onMove(...args) }

  /** @internal */
  runOnClick(...args: Parameters<MousePicker["onClick"]>) { return this.onClick(...args) }

  /** @internal */
  runOnPointerUp(...args: Parameters<MousePicker["onPointerUp"]>) { return this.onPointerUp(...args) }

  /** @internal */
  runOnPointerDown(...args: Parameters<MousePicker["onPointerDown"]>) { return this.onPointerDown(...args) }

  /** @internal */
  runOnDrag(...args: Parameters<MousePicker["onDrag"]>) { return this.onDrag(...args) }
}


export abstract class InertiaMousePicker extends MousePicker {
  private animation?: Animation

  constructor(
    protected readonly globe: Globe,
    protected readonly inertia: Inertia2D,
    private readonly cameraMotion = false
  ) {
    super()
  }

  protected onPointerDown(e: GlobePointerEvent): void {
    this.inertia.reset()
    this.onInertialPointerDown(e)
  }

  protected onPointerUp(): void {
    this.inertia.release()
  }

  protected onDrag(e: GlobePointerDragEvent): void {
    if (this.animation === undefined) {
      this.animation = this.globe.animations.add(animationArgs => {
        this.onInertiaMove(animationArgs)
        this.inertia.evolve(animationArgs.T)
        const { moving } = this.inertia.state
        if (!moving) {
          this.animation?.stop()
        }
      }, { cameraMotion: this.cameraMotion })
      this.animation.then(() => {
        this.animation = undefined
      })
    }
    const d = e.delta()
    this.inertia.dragTo(d.x, d.y)
  }

  protected onInertiaMove(animationArgs: AnimationCallback) {
    animationArgs
  }

  protected onInertialPointerDown(e: GlobePointerEvent) {
    e
  }

  protected onInertiaMoveEnd() {
  }
}
