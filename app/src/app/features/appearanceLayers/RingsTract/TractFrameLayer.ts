import { makePureLayerComponent } from '@stellar-globe/react-stellar-globe'
import { Globe, Layer, V4, View, angle, glMatrix, path } from '@stellar-globe/stellar-globe'
import { RingsTract } from './RingsTract'
const { mat4 } = glMatrix


class Renderer extends path.Renderer {
  constructor(gl: WebGL2RenderingContext) {
    super(gl)
  }

  refreshArray(size: number, showPatch: boolean) {
    this.darkenNarrowLine = false
    this.minWidth = 3
    const s = size
    const w = 0.
    const tractColor: V4 = [0, 1, 0, 0.5]
    const patchColor: V4 = [0, 1, 1, 0.25]
    const paths: path.Path[] = []
    paths.push(
      {
        points: [
          { position: [1, -s, -s], color: tractColor, size: w },
          { position: [1, -s, +s], color: tractColor, size: w },
          { position: [1, +s, +s], color: tractColor, size: w },
          { position: [1, +s, -s], color: tractColor, size: w },
        ],
        close: true,
        joint: 'MITER',
      },
    )
    if (showPatch) {
      for (let i = 1; i < 9; ++i) {
        const t = 2 * s * (-0.5 + (i / 9))
        paths.push({
          points: [
            { position: [1, t, -s], color: patchColor, size: w },
            { position: [1, t, +s], color: patchColor, size: w },
          ],
          close: false,
          joint: 'NONE',
        })
        paths.push({
          points: [
            { position: [1, -s, t], color: patchColor, size: w },
            { position: [1, +s, t], color: patchColor, size: w },
          ],
          close: false,
          joint: 'NONE',
        })
      }
    }
    this.setPaths(paths)
  }

  a = 0
  d = 0

  mMatirx() {
    const cA = Math.cos(this.a)
    const sA = Math.sin(this.a)
    const cD = Math.cos(this.d)
    const sD = Math.sin(this.d)
    return mat4.fromValues(
      cA * cD, cD * sA, -sD, 0,
      -sA, cA, 0, 0,
      cA * sD, sA * sD, cD, 0,
      0, 0, 0, 1)
  }
}


class TractFrameLayer extends Layer {
  private renderer: Renderer
  private ringsTract: RingsTract

  constructor(globe: Globe, showPatch: boolean) {
    super(globe)
    this.renderer = new Renderer(globe.gl)
    this.onRelease(() => this.renderer.release())

    this.ringsTract = new RingsTract(120)

    const pixelScale = 0.168 // arcsec / pixel
    const tractSize = 36000 // in pixels
    const size = 0.5 * tractSize * angle.deg2rad(pixelScale / 3600)
    this.renderer.refreshArray(size, showPatch)
  }

  render(view: View) {
    const { a, d } = this.globe.camera.center()
    const numTractsX = 3
    const numTractsY = 3
    this.ringsTract.tractCenters(a.rad, d.rad, numTractsX, numTractsY, (aa, dd) => {
      this.renderer.modelMatrix = this.renderer.mMatirx()
      this.renderer.a = aa
      this.renderer.d = -dd
      this.renderer.render(view)
    })
  }
}


type Props = {
  showPatch: boolean
  visible?: boolean
}


export const TractFrameLayer$ = makePureLayerComponent<Props>(
  (globe, { showPatch }) => new TractFrameLayer(globe, showPatch),
  'visible',
)
