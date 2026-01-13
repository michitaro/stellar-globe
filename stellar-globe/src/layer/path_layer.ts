import { Globe } from "~/globe"
import { BlendMode, Path, Renderer } from "~/renderer/path_renderer"
import { View } from "~/view"
import { Layer } from "./layer"
import { overlayAlpha } from "./overlayAlpha"


/**
 * dimOnZoomの型
 * - boolean: true の場合は組み込みの overlayAlpha 関数を使用
 * - (fovy: number) => number: カスタム関数で fovy からアルファ値を計算
 */
export type DimOnZoomOption = boolean | ((fovy: number) => number)

type PathLayerOptions = {
  paths: Path[]
  blendMode?: BlendMode
  dimOnZoom?: DimOnZoomOption
  darkenNarrowLine?: boolean
}


export class PathLayer extends Layer {
  protected pathRenderer!: Renderer
  private _dimOnZoom: DimOnZoomOption

  constructor(
    globe: Globe,
    _options: PathLayerOptions,
  ) {
    super(globe)
    const options: Required<PathLayerOptions> = { ...PathLayer.defaultOptions(), ..._options }
    this.pathRenderer = new Renderer(this.globe.gl, options)
    this._dimOnZoom = options.dimOnZoom
    this.onRelease(() => {
      this.pathRenderer.release()
    })
    this.pathRenderer.setPaths(_options.paths)
  }

  render(view: View) {
    let alpha: number
    if (typeof this._dimOnZoom === 'function') {
      // カスタム関数でアルファ値を計算
      alpha = this._dimOnZoom(view.mvp.fovy)
    } else if (this._dimOnZoom) {
      // boolean true の場合は組み込みの overlayAlpha を使用
      alpha = overlayAlpha(view)
    } else {
      alpha = 1
    }
    this.pathRenderer.render(view, alpha)
  }

  set paths(paths: Path[]) {
    this.pathRenderer.setPaths(paths)
    this.globe.requestRefresh()
  }

  set blendeMode(blendMode: BlendMode) {
    this.pathRenderer.blendMode = blendMode
    this.globe.requestRefresh()
  }

  set dimOnZoom(dimOnZoom: DimOnZoomOption) {
    this._dimOnZoom = dimOnZoom
    this.globe.requestRefresh()
  }

  set darkenNarrowLine(darkenNarrowLine: boolean) {
    this.pathRenderer.darkenNarrowLine = darkenNarrowLine
    this.globe.requestRefresh()
  }

  static defaultOptions() {
    return {
      blendMode: 'NORMAL' as BlendMode,
      dimOnZoom: false,
      darkenNarrowLine: true,
    }
  }
}
