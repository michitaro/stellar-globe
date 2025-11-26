import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * 通常エフェクト（パススルー）
 * 何も変更せずに描画する
 */
export class PassThroughEffect extends VisualEffectParams {
  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      varying vec2          v_coord;

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          gl_FragColor = texture2D(u_raw, texCoord);
      }
    `
  }

  setUniforms(_program: Program) {
    // 何も設定しない
  }
}
