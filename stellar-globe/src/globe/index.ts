import { wegblProfile } from "~/devel/webgl-profiler/utils"
import { VisualEffectRenderer, VisualEffectParams } from "~/visualEffects"
import { Layer } from "~/layer/layer"
import { PanLayer } from "~/layer/pan_layer"
import { RollLayer } from "~/layer/roll_layer"
import { TouchLayer } from '~/layer/touch_layer'
import { ZoomLayer } from "~/layer/zoom_layer"
import { EventManager, ReleaseCallbacks } from "~/utils/EventManager"
import { Camera } from "./Camera"
import { AnimationManager } from "./animation"
import { Canvas } from "./canvas"
import { GlobeEventMap } from "./events"
import { PointerEventManager } from "./pointer_event"


type GlobeOptions = {
  preserveBuffer?: boolean
  viewOptions?: ConstructorParameters<typeof Camera>[1]
  /** ビジュアルエフェクト（後処理） */
  visualEffect?: VisualEffectParams
  /** @deprecated visualEffect を使用してください */
  distortion?: VisualEffectParams
  noDefaultLayers?: boolean
  jsdomTest?: boolean
  dataRepository?: string
}

/**
 * The main class for the Stellar Globe viewer.
 * This class manages the WebGL canvas, camera, layers, and rendering loop.
 * 
 * @example
 * ```typescript
 * const container = document.getElementById('viewer');
 * const globe = new Globe(container);
 * globe.addNewLayer(GridLayer);
 * ```
 */
export class Globe {
  readonly camera: Camera
  readonly animations: AnimationManager

  readonly canvas: Canvas

  readonly dataRepository: string

  private visualEffectRenderer?: VisualEffectRenderer
  private _visualEffect?: VisualEffectParams

  constructor(
    readonly containerElement: HTMLElement,
    options: GlobeOptions = {},
  ) {
    this.dataRepository = options.dataRepository ?? `${location.protocol}//hscmap.mtk.nao.ac.jp/stellar-globe/static`

    this.canvas = new Canvas(this, options)
    this.onRelease(() => this.canvas.release())

    containerElement.appendChild(this.canvas.domElement)
    this.onRelease(() => containerElement.removeChild(this.canvas.domElement))

    this.animations = new AnimationManager(this)
    this.onRelease(() => this.animations.clear())

    this.onRelease(PointerEventManager(this))

    this.camera = new Camera(this, { aspectRatio: this.canvas.aspectRatio, ...(options.viewOptions ?? {}) })

    // ビジュアルエフェクトの設定（後方互換性のためdistortionもサポート）
    const effectParams = options.visualEffect ?? options.distortion
    if (effectParams) {
      this.setVisualEffect(effectParams)
    }

    if (!options.noDefaultLayers) {
      initControlLayers(this)
    }

    if (!options.jsdomTest) {
      this.initResizeObserver()
    }

    this.onRelease(() => this._alreadyReleased = true)
    this.onRelease(() => {
      if (this.visualEffectRenderer) {
        this.visualEffectRenderer.release()
      }
    })
  }

  /**
   * ビジュアルエフェクトを設定する
   * @param effect 設定するエフェクト（nullで解除）
   */
  setVisualEffect(effect: VisualEffectParams | null) {
    if (this.visualEffectRenderer) {
      this.visualEffectRenderer.release()
      this.visualEffectRenderer = undefined
    }
    if (effect) {
      this._visualEffect = effect
      this.visualEffectRenderer = new VisualEffectRenderer(this.gl, effect, this)
    } else {
      this._visualEffect = undefined
    }
    this.requestRefresh()
  }

  /**
   * 現在のビジュアルエフェクトを取得
   */
  get visualEffect(): VisualEffectParams | undefined {
    return this._visualEffect
  }

  /**
   * 現在の描画結果をビジュアルエフェクト用スナップショットとして保存する。
   * `TransitionEffect` のような snapshot ベースのエフェクトで使用する。
   */
  captureVisualEffectSnapshot() {
    if (!this.visualEffectRenderer) {
      return false
    }
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId)
      this.rafId = undefined
    }
    // preserveDrawingBuffer に依存せず、直前の描画結果を確実に取得する。
    this.draw()
    this.visualEffectRenderer.captureSnapshot()
    return true
  }

  /**
   * ビジュアルエフェクト用スナップショットを破棄する。
   */
  clearVisualEffectSnapshot() {
    if (!this.visualEffectRenderer) {
      return false
    }
    this.visualEffectRenderer.clearSnapshot()
    return true
  }

  private _alreadyReleased = false

  get alreadyReleased() {
    return this._alreadyReleased
  }

  // layers
  /** @internal */
  readonly layers: Layer[] = []

  get gl() {
    return this.canvas.gl
  }

  // events
  private events = EventManager<GlobeEventMap>()
  /** @internal */
  emit = this.events.emit
  on = this.events.on

  // release callbacks
  private releaseCallbacks = ReleaseCallbacks()
  private onRelease = this.releaseCallbacks.add

  release() {
    for (const layer of this.layers.slice()) {
      layer.release()
    }
    this.releaseCallbacks.flush()
  }

  /** @internal */
  resize() {
    this.canvas.resize(this.camera.retina)
    this.camera.aspectRatio = this.canvas.aspectRatio
    this.emit('resize', {})
    this.requestRefresh()
  }

  private initResizeObserver() {
    const observer = new ResizeObserver(_entries => {
      requestAnimationFrame(() => this.resize())
    })
    observer.observe(this.canvas.domElement)
    this.onRelease(() => {
      observer.disconnect()
    })
    this.resize()
  }

  addNewLayer<LayerConstructor extends new (globe: Globe, ...args: any) => any>(
    layerConstructor: LayerConstructor,
    ...args: LayerConstructorRestParameters<typeof layerConstructor>
  ): LayerType<typeof layerConstructor> {
    const layer = new layerConstructor(this, ...[...args])
    return this.addLayer(layer)
  }

  addLayer<L extends Layer>(layer: L) {
    if (this.hasLayer(layer)) {
      console.warn(layer)
      throw new Error('The layer is added twice')
    }
    this.layers.push(layer)
    this.layerSorter.sort()
    layer.runOnAddToGlobeCallbacks()
    this.requestRefresh()
    this.emit('layer-change', { added: [layer] })
    return layer
  }

  removeLayer(layer: Layer) {
    const i = this.layers.indexOf(layer)
    if (i >= 0) {
      layer.runRemoveFromGlobeCallbacks()
      this.layers.splice(i, 1)
      this.requestRefresh()
      this.emit('layer-change', { removed: [layer] })
    }
  }

  hasLayer(layer: Layer) {
    return this.layers.includes(layer)
  }

  private rafId: number | undefined
  requestRefresh() {
    if (this._alreadyReleased) {
      console.trace('called Globe.requestRefresh after release')
      return
    }
    if (this.rafId === undefined && !this.animations.refreshScheduled) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = undefined
        this.draw()
      })
    }
  }

  /** @internal */
  draw() {
    if (this._alreadyReleased) {
      return
    }
    const gl = this.gl
    const canvasEl = this.canvas.domElement
    wegblProfile(this.gl, 'draw', () => {
      gl.colorMask(true, true, true, true)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (this.visualEffectRenderer && this._visualEffect) {
        this.visualEffectRenderer.pipeAndDraw(() => {
          const scale = this._visualEffect!.scale
          const { width: width0, height: height0 } = canvasEl
          canvasEl.width = Math.floor(canvasEl.width * scale)
          canvasEl.height = Math.floor(canvasEl.height * scale)
          gl.clear(gl.COLOR_BUFFER_BIT)
          for (const layer of this.layers) {
            layer.render(this.camera.view())
          }
          canvasEl.width = width0
          canvasEl.height = height0
        })
      }
      else {
        const view = this.camera.view()
        for (const layer of this.layers) {
          layer.render(view)
        }
        // backbufferのalphaをクリア
        gl.clearColor(0, 0, 0, 1)
        gl.colorMask(false, false, false, true)
        gl.clear(gl.COLOR_BUFFER_BIT)
        // asyncでwebglが呼ばれたときのためにリセット
        gl.colorMask(true, true, true, true)
        gl.flush()
      }
    })
  }

  readonly layerSorter = new LayerSorter(this)

  private cursorMemo: CursorStyle = 'default'

  /** @internal */
  setCursor(cursor: CursorStyle) {
    if (this.cursorMemo !== cursor) {
      this.cursorMemo = cursor
      // this.canvas.domElement.style.cursor = cursor
      this.containerElement.style.cursor = cursor
    }
  }
}


export type CursorStyle = "alias" | "all-scroll" | "auto" | "cell" | "col-resize" | "context-menu" | "copy" | "crosshair" | "default" | "e-resize" | "ew-resize" | "grab" | "grabbing" | "help" | "move" | "n-resize" | "ne-resize" | "nesw-resize" | "no-drop" | "none" | "not-allowed" | "ns-resize" | "nw-resize" | "nwse-resize" | "pointer" | "progress" | "row-resize" | "s-resize" | "se-resize" | "sw-resize" | "text" | "vertical-text" | "w-resize" | "wait" | "zoom-in" | "zoom-out"


// These 2 types are for Globe.addNewLayer

export type LayerConstructorRestParameters<
  T extends abstract new (globe: Globe, ...args: any) => any
> = T extends abstract new (globe: Globe, ...args: infer P) => any ? P : never

type LayerType<
  T extends abstract new (globe: Globe, ...args: any) => any
> = T extends abstract new (globe: Globe, ...args: any) => infer P ? P : never


class LayerSorter {
  constructor(
    private globe: Globe,
  ) {
  }

  private sortFunc?: ((a: Layer, b: Layer) => number)

  setSortFunc(f?: (a: Layer, b: Layer) => number) {
    this.sortFunc = f
    if (f) {
      this.sort()
      this.globe.requestRefresh()
    }
  }

  sort() {
    this.sortFunc && this.globe.layers.sort(this.sortFunc)
  }
}


function initControlLayers(globe: Globe) {
  globe.addNewLayer(PanLayer)
  globe.addNewLayer(RollLayer)
  globe.addNewLayer(ZoomLayer)
  globe.addNewLayer(TouchLayer)
}
