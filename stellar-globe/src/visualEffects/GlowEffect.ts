import { Program } from '../lib/gl-wrapper'
import { RenderTargetInfo, VisualEffectParams } from './VisualEffectParams'


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
  /** オフスクリーンテクスチャ上の 1 ピクセル幅 */
  texelSize: [number, number] = [1 / 1024, 1 / 1024]

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform vec2          u_texel_size;
      uniform float         u_intensity;
      uniform float         u_threshold;
      uniform float         u_radius;
      varying vec2          v_coord;

      float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
      }

      float luminance(vec3 color) {
          return dot(color, vec3(0.299, 0.587, 0.114));
      }

      vec3 extractBright(vec3 color) {
          float brightness = luminance(color);
          float knee = max(0.03, (1.0 - u_threshold) * 0.2);
          float strength = smoothstep(max(u_threshold - knee, 0.0), min(u_threshold + knee, 1.0), brightness);
          return color * strength;
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 color = texture2D(u_raw, texCoord);

          vec2 texMax = u_tex_matrix * vec2(1.0, 1.0);
          vec2 pixelSize = u_texel_size;

          // 明るい部分を抽出した画像をガウシアンブラーして加算する
          vec3 glow = vec3(0.0);
          float totalWeight = 0.0;

          for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                  vec2 offset = vec2(x, y) * pixelSize * max(u_radius, 0.001);
                  vec2 sampleTexCoord = clamp(texCoord + offset, vec2(0.0), texMax);
                  vec3 sampleColor = texture2D(u_raw, sampleTexCoord).rgb;
                  float weight = gaussian(length(vec2(x, y)), 2.0);

                  glow += extractBright(sampleColor) * weight;
                  totalWeight += weight;
              }
          }

          if (totalWeight > 0.0) {
              glow /= totalWeight;
          }

          gl_FragColor = vec4(color.rgb + glow * u_intensity, color.a);
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_intensity: this.intensity,
      u_threshold: this.threshold,
      u_radius: this.radius,
    })
    program.uniform2fv({
      u_texel_size: this.texelSize,
    })
  }

  setRenderTargetInfo(info: RenderTargetInfo) {
    this.texelSize = info.texelSize
  }
}
