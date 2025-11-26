import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from '.'


/**
 * プラネタリウム投影用エフェクト
 * 通常の画像を魚眼レンズのような円形投影に変換する
 */
export class PlanetariumEffect extends VisualEffectParams {
  /** ガンマ補正値 */
  gamma = 1;
  /** アルファ（明るさ）係数 */
  alpha = 1;
  /** レンダリングスケール */
  scale = 1.5;

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_gamma;
      uniform float         u_alpha;
      varying vec2          v_coord;
      
      #define M_PI 3.14159265359
      
      void main(void){
          vec2 xy = 2. * v_coord - vec2(1.);
          float r = length(xy);
          float r0 = tan(0.25 * M_PI * r);
          vec2 xy0 = (r == 0. ? 0. : (r0 / r)) * xy;
          xy0 = 0.5 * (xy0 + vec2(1.));
          vec4 rgba = texture2D(u_raw, u_tex_matrix * xy0);
          rgba = pow(rgba, vec4(u_gamma));
          rgba.rgb *= vec3(u_alpha);
          if (r > 1.) {
            discard;
          }
          else {
            gl_FragColor = rgba;
          }
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_gamma: this.gamma,
      u_alpha: this.alpha,
    })
  }
}
