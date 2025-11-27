import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * ブルームエフェクト
 * 元の画像とガウシアンブラーを合成する（グロー効果の改良版）
 */
export class BloomEffect extends VisualEffectParams {
  /** ブラーの強度（半径） */
  blurRadius = 5.0
  /** 元画像のブレンド比率（0-1） */
  originalBlend = 1.0
  /** ブラーのブレンド比率（0-1） */
  blurBlend = 0.5
  /** 明るさの閾値（この値以上がブルーム対象） */
  threshold = 0.3
  /** アスペクト比（縦横比補正用） */
  aspectRatio = 1.0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_blur_radius;
      uniform float         u_original_blend;
      uniform float         u_blur_blend;
      uniform float         u_threshold;
      uniform float         u_aspect_ratio;
      varying vec2          v_coord;
      
      // ガウス関数
      float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
      }
      
      // 輝度を計算
      float luminance(vec3 color) {
          return dot(color, vec3(0.299, 0.587, 0.114));
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 originalColor = texture2D(u_raw, texCoord);
          
          // ピクセルサイズ（アスペクト比を考慮）
          float basePixelSize = 0.001;
          vec2 pixelSize = vec2(basePixelSize, basePixelSize * u_aspect_ratio);
          
          // ガウシアンブラーを計算（閾値以上の明るい部分のみ）
          vec4 blurColor = vec4(0.0);
          float totalWeight = 0.0;
          float sigma = u_blur_radius / 3.0;
          
          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * (u_blur_radius / 4.0);
                  vec2 sampleCoord = v_coord + offset;
                  
                  // 境界外のサンプリングをクランプ
                  sampleCoord = clamp(sampleCoord, vec2(0.001), vec2(0.999));
                  
                  vec2 sampleTexCoord = u_tex_matrix * sampleCoord;
                  vec4 sampleColor = texture2D(u_raw, sampleTexCoord);
                  
                  // 閾値以上の明るさのみブラーに寄与
                  float lum = luminance(sampleColor.rgb);
                  if (lum > u_threshold) {
                      float dist = length(vec2(x, y));
                      float weight = gaussian(dist, sigma);
                      
                      // 閾値を超えた分だけを加算
                      vec4 brightPart = sampleColor * (lum - u_threshold) / max(lum, 0.001);
                      blurColor += brightPart * weight;
                      totalWeight += weight;
                  }
              }
          }
          
          if (totalWeight > 0.0) {
              blurColor /= totalWeight;
          }
          
          // 元の画像とブラーを合成
          vec4 finalColor = originalColor * u_original_blend + blurColor * u_blur_blend;
          
          gl_FragColor = finalColor;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_blur_radius: this.blurRadius,
      u_original_blend: this.originalBlend,
      u_blur_blend: this.blurBlend,
      u_threshold: this.threshold,
      u_aspect_ratio: this.aspectRatio,
    })
  }
}
