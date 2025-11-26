import { AttribList, Program } from '../lib/gl-wrapper'
import { CaptureTarget } from '../globe/CaptureTarget'

// VisualEffectParamsを再エクスポート
export { VisualEffectParams, DistortionParams } from './VisualEffectParams'

// エフェクトの再エクスポート
export { PlanetariumEffect } from './PlanetariumEffect'
export { MotionBlurEffect } from './MotionBlurEffect'
export { GlowEffect } from './GlowEffect'
export { FrostedGlassEffect } from './FrostedGlassEffect'
export { RippleEffect } from './RippleEffect'
export { WarpEffect } from './WarpEffect'
export { PassThroughEffect } from './PassThroughEffect'

// 内部インポート（VisualEffectRendererで使用）
import { VisualEffectParams } from './VisualEffectParams'


/**
 * ビジュアルエフェクトのレンダラー
 * シーンをオフスクリーンにレンダリングし、エフェクトを適用して画面に描画する
 */
export class VisualEffectRenderer {
  private attribList: AttribList
  private program: Program
  private captureTarget: CaptureTarget

  constructor(
    readonly gl: WebGL2RenderingContext,
    readonly params: VisualEffectParams,
  ) {
    this.captureTarget = new CaptureTarget(gl)
    this.attribList = new AttribList(gl, {
      members: [{
        name: "a_coord",
        nComponents: 2,
      }],
      array: new Float32Array([0, 0, /**/ 1, 0, /**/ 1, 1, /**/ 0, 0,  /**/ 1, 1, /**/ 0, 1]),
    })
    const vertextShader = `
      attribute  vec2   a_coord;
      varying    vec2   v_coord;
      
      void main(void) {
          gl_Position = vec4(2. * a_coord - vec2(1.), 0., 1.);
          v_coord = a_coord;
      }
    `
    this.program = Program.new(gl, vertextShader, params.fragShader())
  }

  release() {
    this.attribList.release()
    this.program.release()
    this.captureTarget.release()
  }

  pipeAndDraw(cb: () => void) {
    this.captureTarget.capture(cb)
    this.draw()
  }

  private draw() {
    const { gl, program, captureTarget } = this
    program.use()
    program.uniformMatrix2fv({
      u_tex_matrix: captureTarget.texMatrix(),
    })
    this.attribList.enable(program, () => {
      program.uniform1i({
        u_raw: 0,
      })
      this.params.setUniforms(program)
      gl.bindTexture(gl.TEXTURE_2D, captureTarget.rawOutput.name)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, null)
    })
  }
}
