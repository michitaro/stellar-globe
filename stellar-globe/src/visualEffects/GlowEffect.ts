import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


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
  /** アスペクト比（縦横比補正用） */
  aspectRatio = 1.0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_intensity;
      uniform float         u_threshold;
      uniform float         u_radius;
      uniform float         u_aspect_ratio;
      varying vec2          v_coord;

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 color = texture2D(u_raw, texCoord);
          
          // ピクセルサイズ（正規化座標系で、アスペクト比を考慮）
          float basePixelSize = 0.002;
          vec2 pixelSize = vec2(basePixelSize, basePixelSize * u_aspect_ratio);
          
          // ガウシアンブラー風のサンプリングでグローを計算
          vec4 glow = vec4(0.0);
          float totalWeight = 0.0;
          
          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * u_radius;
                  vec2 sampleCoord = v_coord + offset;
                  
                  // 境界外のサンプリングをクランプ
                  sampleCoord = clamp(sampleCoord, vec2(0.001), vec2(0.999));
                  
                  vec2 sampleTexCoord = u_tex_matrix * sampleCoord;
                  vec4 sampleColor = texture2D(u_raw, sampleTexCoord);
                  
                  // 明るさを計算
                  float brightness = dot(sampleColor.rgb, vec3(0.299, 0.587, 0.114));
                  
                  // 閾値以上の部分のみグローに寄与
                  if (brightness > u_threshold) {
                      float weight = exp(-(x*x + y*y) / 8.0);
                      glow += sampleColor * weight * (brightness - u_threshold);
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
      u_aspect_ratio: this.aspectRatio,
    })
  }
}
