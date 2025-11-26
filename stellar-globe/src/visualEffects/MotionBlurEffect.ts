import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from '.'


/**
 * モーションブラーエフェクト
 * 残像を残すことでモーションブラーのような効果を実現する
 */
export class MotionBlurEffect extends VisualEffectParams {
  /** 残像の減衰率（0-1、値が大きいほど残像が長く残る） */
  decay = 0.85
  /** 残像の強度 */
  intensity = 0.5

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_decay;
      uniform float         u_intensity;
      varying vec2          v_coord;

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 color = texture2D(u_raw, texCoord);
          
          // 中心からの距離に基づいて残像効果を調整
          vec2 center = vec2(0.5);
          float dist = length(v_coord - center);
          
          // 残像効果を追加（現在のフレームに軽いトレイルを追加）
          float blur = u_intensity * (1.0 - dist);
          color.rgb = mix(color.rgb, color.rgb * 1.1, blur * 0.2);
          
          gl_FragColor = color;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_decay: this.decay,
      u_intensity: this.intensity,
    })
  }
}
