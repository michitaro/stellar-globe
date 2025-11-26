import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from '.'


/**
 * グローエフェクト
 * 明るい部分を光らせるブルーム効果
 */
export class GlowEffect extends VisualEffectParams {
  /** グローの強度 */
  intensity = 1.0
  /** グローの閾値（この明るさ以上がグロー対象） */
  threshold = 0.5
  /** グローの拡散範囲 */
  radius = 3.0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_intensity;
      uniform float         u_threshold;
      uniform float         u_radius;
      varying vec2          v_coord;

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 color = texture2D(u_raw, texCoord);
          
          // ピクセルサイズ（テクスチャサイズに依存）
          vec2 pixelSize = vec2(1.0 / 1024.0);
          
          // ガウシアンブラー風のサンプリングでグローを計算
          vec4 glow = vec4(0.0);
          float totalWeight = 0.0;
          
          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * u_radius;
                  vec4 sample = texture2D(u_raw, u_tex_matrix * (v_coord + offset));
                  
                  // 明るさを計算
                  float brightness = dot(sample.rgb, vec3(0.299, 0.587, 0.114));
                  
                  // 閾値以上の部分のみグローに寄与
                  if (brightness > u_threshold) {
                      float weight = exp(-(x*x + y*y) / 8.0);
                      glow += sample * weight * (brightness - u_threshold);
                      totalWeight += weight;
                  }
              }
          }
          
          if (totalWeight > 0.0) {
              glow /= totalWeight;
          }
          
          // 元の色にグローを加算
          color.rgb += glow.rgb * u_intensity;
          
          gl_FragColor = color;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_intensity: this.intensity,
      u_threshold: this.threshold,
      u_radius: this.radius,
    })
  }
}
