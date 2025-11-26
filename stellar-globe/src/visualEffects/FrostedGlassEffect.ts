import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from '.'


/**
 * すりガラスエフェクト
 * 画像をぼかしてすりガラス越しに見るような効果
 */
export class FrostedGlassEffect extends VisualEffectParams {
  /** ぼかしの強度 */
  blurAmount = 2.0
  /** ノイズの強度（すりガラスの粒感） */
  noiseAmount = 0.02
  /** 時間（アニメーション用） */
  time = 0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_blur_amount;
      uniform float         u_noise_amount;
      uniform float         u_time;
      varying vec2          v_coord;
      
      // シンプルなノイズ関数
      float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec2 pixelSize = vec2(1.0 / 1024.0);
          
          // ランダムなオフセットを追加（すりガラスの粒感）
          float noise = rand(v_coord + u_time);
          vec2 noiseOffset = vec2(
              rand(v_coord + vec2(u_time, 0.0)) - 0.5,
              rand(v_coord + vec2(0.0, u_time)) - 0.5
          ) * u_noise_amount;
          
          // ガウシアンブラー
          vec4 color = vec4(0.0);
          float totalWeight = 0.0;
          
          for (float x = -3.0; x <= 3.0; x += 1.0) {
              for (float y = -3.0; y <= 3.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * u_blur_amount + noiseOffset;
                  float weight = exp(-(x*x + y*y) / 8.0);
                  color += texture2D(u_raw, u_tex_matrix * (v_coord + offset)) * weight;
                  totalWeight += weight;
              }
          }
          
          color /= totalWeight;
          gl_FragColor = color;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_blur_amount: this.blurAmount,
      u_noise_amount: this.noiseAmount,
      u_time: this.time,
    })
  }

  update(deltaTime: number) {
    this.time += deltaTime * 0.001
  }
}
