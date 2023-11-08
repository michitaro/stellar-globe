import { Globe } from '~/globe'
import { Layer } from "~/layer/layer"
import { Renderer } from "~/renderer/tile_renderer"
import { TileId } from '~/renderer/tile_renderer/tract'
import { View } from "~/view"
import { overlayAlpha } from "../overlayAlpha"
import { AreaRenderer } from "./AreaRenderer"
import { SspTileTextureProvider } from "./TextureProvider"
import { SspTileParams, sspTileDefaultParams, sspTileParamsAssertType } from "./TextureProvider/params"
import { V3 } from '~/types'


type Options = {
  baseUrl: string
  outline?: boolean
  colorParams?: SspTileParams
}

type FilterList = ConstructorParameters<typeof AreaRenderer>[2]


export class SspTileLayer extends Layer {
  private tileRenderer: Renderer<SspTileTextureProvider>
  private areaRenderer: AreaRenderer
  alpha = 1
  outline: boolean

  constructor(globe: Globe, options: Options) {
    super(globe)

    const baseUrl = options.baseUrl
    const colorParams = options.colorParams ?? sspTileDefaultParams({ type: 'sdssTrueColor' })
    const filters = outlineFilter(colorParams)
    this.outline = options.outline ?? false

    const textureProvider = new SspTileTextureProvider(globe, baseUrl, colorParams)
    this.onRelease(() => textureProvider.release())
    this.tileRenderer = new Renderer(globe, textureProvider)
    this.onRelease(() => this.tileRenderer.release())
    this.areaRenderer = new AreaRenderer(globe, baseUrl, filters)
    this.onRelease(() => this.areaRenderer.release())
  }

  render(view: View): void {
    const alpha = overlayAlpha(view)
    this.tileRenderer.render(view, 1 - alpha)
    this.outline && this.areaRenderer.render(view, this.alpha * alpha)
  }

  setParams(params: Parameters<SspTileTextureProvider["setParams"]>[0]) {
    const changeParamLod = 2 + Math.log2(this.globe.camera.canvasPixels)
    const { textureProvider } = this.tileRenderer
    const view = this.globe.camera.view()
    const visibleTiles = new Set<TileId>()
    this.tileRenderer.visibleTiles(view, changeParamLod, tileId => visibleTiles.add(tileId))
    textureProvider.setParams(params)
    textureProvider.clearCache(tileId => {
      return visibleTiles.has(tileId)
    })
    this.setAreaFilters(outlineFilter(params))
    this.globe.requestRefresh()
  }

  private setAreaFilters(filters: FilterList) {
    this.areaRenderer.setFilter(filters)
    this.globe.requestRefresh()
  }

  static defaultParams = sspTileDefaultParams
  static assertType: typeof sspTileParamsAssertType = sspTileParamsAssertType
}


function outlineFilter(params: SspTileParams): FilterList {
  const rgb: V3[] = [
    [1., 0.25, 0.25],
    [0.25, 1, 0.25],
    [0.25, 0.25, 1],
  ]

  switch (params.type) {
    case 'sdssTrueColor': case 'simpleRgb':
      return params.filters.map((f, i) => ({ filterName: f, color: rgb[i] }))
    case 'sdssTrueColorMatrix':
      return params.filters.map((f, i) => ({ filterName: f, color: params.sdssTrueColorMatrix.colors[i] }))
    case 'simpleColorMatrix':
      return params.filters.map((f, i) => ({ filterName: f, color: params.simpleColorMatrix.colors[i] }))
  }
}
