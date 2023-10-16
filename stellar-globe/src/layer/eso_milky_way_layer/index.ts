import { mat4 } from 'gl-matrix'
import { config } from '~/config'
import { Globe } from '~/globe'
import { Layer } from '~/layer/layer'
import { overlayAlpha } from '~/layer/overlayAlpha'
import { ImageLike } from '~/lib/gl-wrapper'
import { CubeMapRenderer } from '~/renderer/cube_map_renderer'
import { loadImage } from '~/utils/image'
import { View } from '~/view'

// thanks to ESO/S. Brunier
// https://www.eso.org/public/images/eso0932a/


type Options = {
  fadeInDuration?: number
}


export class EsoMilkyWayLayer extends Layer {
  private renderer?: EsoMilkyWay

  constructor(
    globe: Globe,
    private readonly options: Options = {},
  ) {
    super(globe)
    this.loadImages()
  }

  private fadeAlpha = 0

  private async loadImages() {
    let alive = true
    this.onRelease(() => alive = false)
    const gl = this.globe.gl
    const maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)
    const images = await EsoMilkyWay.loadImages(maxCubeMapSize)
    if (alive) {
      this.renderer = new EsoMilkyWay(this.globe.gl, images)
      this.onRelease(() => this.renderer?.release())
      this.addAnimation(({ r }) => {
        this.fadeAlpha = r
      }, { duration: this.options.fadeInDuration ?? 0 })
    }
  }

  render(view: View) {
    const alpha = overlayAlpha(view) * this.fadeAlpha
    this.renderer?.render(view, alpha)
  }

  static attributions = [{
    which: 'The Milky Way Panorama',
    label: 'ESO/S. Brunier',
    link: 'https://www.eso.org/public/images/eso0932a/',
  }]
}


class EsoMilkyWay extends CubeMapRenderer {
  constructor(
    gl: WebGLRenderingContext,
    images: ImageLike[],
  ) {
    super(gl)
    this.setCubeImage(images)
  }

  private m = mat4.fromValues(
    +0.0017373464070261, -0.4792437255382538, -0.8776800036430359, 0,
    +0.8911036849021912, +0.3990314602851868, -0.2161209583282471, 0,
    +0.4537965655326843, -0.7817283272743225, +0.4277492463588715, 0,
    0, 0, 0, 1,
  )

  mMatrix() {
    return this.m
  }

  static async loadImages(maxCubeMapSize: number) {
    const urls1024 = ['px', 'py', 'pz', 'nx', 'ny', 'nz']
      .map((dir) => `${config.dataRepository}/eso_milky_way_layer/images-1024/${dir}.png`)
    const urls512 = ['px', 'py', 'pz', 'nx', 'ny', 'nz']
      .map((dir) => `${config.dataRepository}/eso_milky_way_layer/images-512/${dir}.png`)

    const urls = maxCubeMapSize >= 1024 ? urls1024 : urls512
    const images = await Promise.all(urls.map(url => loadImage(url, { flipY: false })))
    return images
  }

  // private enableMatrixCalibrator() {
  //   let scale = 0.001
  //   const globe = this.globe
  //   // @ts-ignore
  //   return on(document, 'keydown', (e: KeyboardEvent) => {
  //     const camera = globe.viewFactory.view().camera
  //     switch (e.code) {
  //       case 'KeyA':
  //         scale *= e.shiftKey ? 0.5 : 2
  //         break
  //       case 'KeyR':
  //         mat4.rotate(this.m, this.m, (e.shiftKey ? +1 : -1) * scale, camera.direction)
  //         globe.requestRefresh()
  //         break
  //       case 'KeyX':
  //         mat4.rotate(this.m, this.m, (e.shiftKey ? +1 : -1) * scale, camera.up)
  //         globe.requestRefresh()
  //         break
  //       case 'KeyY':
  //         const axis = vec3.cross(vec3.create(), camera.up, camera.direction)
  //         mat4.rotate(this.m, this.m, (e.shiftKey ? +1 : -1) * scale, axis)
  //         globe.requestRefresh()
  //         break
  //     }
  //     console.log(this.m)
  //   })
  // }
}
