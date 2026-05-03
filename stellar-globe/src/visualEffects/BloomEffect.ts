import { Program } from '../lib/gl-wrapper'
import { RenderTargetInfo, VisualEffectParams } from './VisualEffectParams'


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
  /** オフスクリーンテクスチャ上の 1 ピクセル幅 */
  texelSize: [number, number] = [1 / 1024, 1 / 1024]

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform vec2          u_texel_size;
      uniform float         u_blur_radius;
      uniform float         u_original_blend;
      uniform float         u_blur_blend;
      uniform float         u_threshold;
      varying vec2          v_coord;
      
      // ガウス関数
      float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
      }
      
      // 輝度を計算
      float luminance(vec3 color) {
          return dot(color, vec3(0.299, 0.587, 0.114));
      }

      vec3 extractBright(vec3 color) {
          float lum = luminance(color);
          float knee = max(0.03, (1.0 - u_threshold) * 0.2);
          float strength = smoothstep(max(u_threshold - knee, 0.0), min(u_threshold + knee, 1.0), lum);
          return color * strength;
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 originalColor = texture2D(u_raw, texCoord);

          vec2 texMax = u_tex_matrix * vec2(1.0, 1.0);
          vec2 pixelSize = u_texel_size;

          // 明るい部分を抽出した画像をぼかしてから元画像へ加算する
          vec3 blurColor = vec3(0.0);
          float totalWeight = 0.0;
          float sigma = 2.0;
          
          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * max(u_blur_radius, 0.001);
                  vec2 sampleTexCoord = clamp(texCoord + offset, vec2(0.0), texMax);
                  vec3 sampleColor = texture2D(u_raw, sampleTexCoord).rgb;
                  float weight = gaussian(length(vec2(x, y)), sigma);

                  blurColor += extractBright(sampleColor) * weight;
                  totalWeight += weight;
              }
          }

          if (totalWeight > 0.0) {
              blurColor /= totalWeight;
          }

          vec3 finalColor = originalColor.rgb * u_original_blend + blurColor * u_blur_blend;
          gl_FragColor = vec4(finalColor, originalColor.a);
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_blur_radius: this.blurRadius,
      u_original_blend: this.originalBlend,
      u_blur_blend: this.blurBlend,
      u_threshold: this.threshold,
    })
    program.uniform2fv({
      u_texel_size: this.texelSize,
    })
  }

  setRenderTargetInfo(info: RenderTargetInfo) {
    this.texelSize = info.texelSize
  }
}
