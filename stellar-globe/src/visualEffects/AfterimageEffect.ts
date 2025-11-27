import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * 残像エフェクト（Afterimage Effect）
 * 前フレームの残像を残すことで目眩のような効果を実現
 * 
 * 注意: このエフェクトはVisualEffectRendererの前フレーム保持機能を使用します。
 * シェーダーでu_previous_frameテクスチャを使用できます。
 */
export class AfterimageEffect extends VisualEffectParams {
  /** 残像の減衰率（0-1、値が大きいほど残像が長く残る） */
  decay = 0.85
  /** 残像のブレンド比率 */
  blend = 0.7
  /** 残像に適用するブラー量（0で無効） */
  blurAmount = 0.0
  /** アスペクト比 */
  aspectRatio = 1.0
  
  /** 前フレームテクスチャを使用するフラグ */
  readonly usesPreviousFrame = true

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform sampler2D     u_previous_frame;
      uniform mat2          u_tex_matrix;
      uniform float         u_decay;
      uniform float         u_blend;
      uniform float         u_blur_amount;
      uniform float         u_aspect_ratio;
      uniform float         u_has_previous;
      varying vec2          v_coord;
      
      // ガウス関数
      float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 currentColor = texture2D(u_raw, texCoord);
          
          // 前フレームがない場合は現在のフレームをそのまま表示
          if (u_has_previous < 0.5) {
              gl_FragColor = currentColor;
              return;
          }
          
          // 前フレームの色を取得（オプションでブラー付き）
          vec4 previousColor;
          
          if (u_blur_amount > 0.001) {
              // ブラー付きで前フレームをサンプリング
              float basePixelSize = 0.002;
              vec2 pixelSize = vec2(basePixelSize, basePixelSize * u_aspect_ratio);
              
              previousColor = vec4(0.0);
              float totalWeight = 0.0;
              float sigma = u_blur_amount / 2.0;
              
              for (float x = -2.0; x <= 2.0; x += 1.0) {
                  for (float y = -2.0; y <= 2.0; y += 1.0) {
                      vec2 offset = vec2(x, y) * pixelSize * u_blur_amount;
                      vec2 sampleCoord = v_coord + offset;
                      sampleCoord = clamp(sampleCoord, vec2(0.001), vec2(0.999));
                      vec2 sampleTexCoord = u_tex_matrix * sampleCoord;
                      
                      vec4 sampleColor = texture2D(u_previous_frame, sampleTexCoord);
                      float dist = length(vec2(x, y));
                      float weight = gaussian(dist, sigma);
                      
                      previousColor += sampleColor * weight;
                      totalWeight += weight;
                  }
              }
              previousColor /= totalWeight;
          } else {
              previousColor = texture2D(u_previous_frame, texCoord);
          }
          
          // 前フレームを減衰させる
          previousColor.rgb *= u_decay;
          
          // 現在のフレームと前フレームをブレンド
          // blend = 0: 現在のフレームのみ
          // blend = 1: 前フレームが完全に混ざる
          vec4 finalColor = mix(currentColor, max(currentColor, previousColor), u_blend);
          
          gl_FragColor = finalColor;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_decay: this.decay,
      u_blend: this.blend,
      u_blur_amount: this.blurAmount,
      u_aspect_ratio: this.aspectRatio,
    })
  }
}
