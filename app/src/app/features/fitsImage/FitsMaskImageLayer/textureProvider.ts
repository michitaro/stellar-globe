import { Globe, V4, fits, tile } from '@stellar-globe/stellar-globe'
import { buildMaskTiles } from './makeTiles'

export class FitsMaskTextureProvider extends tile.AsyncTextureProvider {
  private tract: tile.Tract
  private tiles: { [path: string]: Uint8ClampedArray } = {}

  constructor(globe: Globe, options: { hdu: fits.Hdu, color: V4, maskBit: number }) {
    super(globe)
    const { hdu, color } = options
    this.tract = tile.Tract.fromFitsHeader(hdu.header)
    this.tiles = buildMaskTiles(hdu, options.maskBit)
  }

  async makeTileTexture(...[ref, { fadeIn, sync }]: Parameters<tile.AsyncTextureProvider['makeTileTexture']>): Promise<tile.TileTexture> {
    const revision = this.revision
    const path = `${ref.level}/${ref.p}/${ref.q}`
    const ab = this.tiles[path]
    if (ab === undefined) {
      throw new Error(`Tile not found: ${path}`)
    }
    const tt = new tile.TileTexture(this, { fadeIn, revision })
    const gl = this.globe.gl
    const { tileSize } = ref.tract
    tt.tex.bind(() => {
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, tileSize, tileSize, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, ab)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, tileSize, tileSize, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, ab)
      if (ref.level === ref.tract.maxTileLevel) {
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      }
      if (ref.level === 0) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      }
    })
    return tt
  }

  walkTracts(callback: (tract: tile.Tract) => void): void {
    callback(this.tract)
  }
}
