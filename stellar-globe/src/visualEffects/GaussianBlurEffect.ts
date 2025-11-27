import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * ガウシアンブラーエフェクト
 * 画像全体にガウシアンぼかしを適用
 */
export class GaussianBlurEffect extends VisualEffectParams {
  /** ぼかしの強度（半径） */
  radius = 5.0
  /** サンプル数（品質、大きいほど滑らかだが重い） */
  samples = 9
  /** アスペクト比（縦横比補正用） */
  aspectRatio = 1.0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_radius;
      uniform float         u_aspect_ratio;
      varying vec2          v_coord;
      
      // ガウス関数
      float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          
          // ピクセルサイズ（アスペクト比を考慮）
          float basePixelSize = 0.001;
          vec2 pixelSize = vec2(basePixelSize, basePixelSize * u_aspect_ratio);
          
          // 2パスガウシアンブラーを1パスで実装（近似）
          vec4 color = vec4(0.0);
          float totalWeight = 0.0;
          float sigma = u_radius / 3.0;
          
          // 9x9 サンプリング
          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * (u_radius / 4.0);
                  vec2 sampleCoord = v_coord + offset;
                  
                  // 境界外のサンプリングをクランプ
                  sampleCoord = clamp(sampleCoord, vec2(0.001), vec2(0.999));
                  
                  vec2 sampleTexCoord = u_tex_matrix * sampleCoord;
                  vec4 sampleColor = texture2D(u_raw, sampleTexCoord);
                  
                  // 2Dガウス重み
                  float dist = length(vec2(x, y));
                  float weight = gaussian(dist, sigma);
                  
                  color += sampleColor * weight;
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
      u_radius: this.radius,
      u_aspect_ratio: this.aspectRatio,
    })
  }
}
