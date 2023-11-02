import { Globe } from '~/globe'
import { Layer } from "~/layer/layer"
import { Renderer } from "~/renderer/tile_renderer"
import { TileId } from '~/renderer/tile_renderer/tract'
import { View } from "~/view"
import { overlayAlpha } from "../overlayAlpha"
import { AreaRenderer } from "./AreaRenderer"
import { SspTileTextureProvider } from "./TextureProvider"
import { SspTileParams, sspTileDefaultParams, sspTileParamsAssertType } from "./TextureProvider/params"


type Options = {
  baseUrl: string
  filters?: ConstructorParameters<typeof AreaRenderer>[2]
  outline?: boolean
  colorParams?: SspTileParams
}


export class SspTileLayer extends Layer {
  private tileRenderer: Renderer<SspTileTextureProvider>
  private areaRenderer: AreaRenderer
  alpha = 1
  outline: boolean

  constructor(globe: Globe, options: Options) {
    super(globe)

    const baseUrl = options.baseUrl
    const filters = options.filters ?? defaultAreaFilters
    const colorParams = options.colorParams ?? sspTileDefaultParams('sdssTrueColor')
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

  setParams(...args: Parameters<SspTileTextureProvider["setParams"]>) {
    const changeParamLod = 2 + Math.log2(this.globe.camera.canvasPixels)
    const { textureProvider } = this.tileRenderer
    const view = this.globe.camera.view()
    const visibleTiles = new Set<TileId>()
    this.tileRenderer.visibleTiles(view, changeParamLod, tileId => visibleTiles.add(tileId))
    textureProvider.setParams(...args)
    textureProvider.clearCache(tileId => {
      return visibleTiles.has(tileId)
    })
    this.globe.requestRefresh()
  }

  setAreaFilters(filters: Options["filters"]) {
    this.areaRenderer.setFilter(filters ?? defaultAreaFilters)
    this.globe.requestRefresh()
  }

  static defaultParams = sspTileDefaultParams
  static assertType: typeof sspTileParamsAssertType = sspTileParamsAssertType
}

const defaultAreaFilters: NonNullable<Options["filters"]> = [
  {
    filterName: 'HSC-G',
    color: [0.2, 0.25, 1],
  },
  {
    filterName: 'HSC-R',
    color: [0.25, 1, 0.25],
  },
  {
    filterName: 'HSC-I',
    color: [1, 0.25, 0.25],
  },
]
