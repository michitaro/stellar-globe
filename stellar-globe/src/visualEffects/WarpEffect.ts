import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * Star Warsワープエフェクト
 * ハイパースペースジャンプのような光の筋効果
 */
export class WarpEffect extends VisualEffectParams {
  /** ワープの強度（0-1、1でフルワープ） */
  warpStrength = 0.0
  /** 光の筋の長さ */
  streakLength = 0.3
  /** 中心X（0-1） */
  centerX = 0.5
  /** 中心Y（0-1） */
  centerY = 0.5
  /** 色の彩度ブースト */
  saturationBoost = 1.2

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform float         u_warp_strength;
      uniform float         u_streak_length;
      uniform vec2          u_center;
      uniform float         u_saturation_boost;
      varying vec2          v_coord;

      void main(void) {
          vec2 center = u_center;
          vec2 uv = v_coord - center;
          float dist = length(uv);
          vec2 dir = normalize(uv);
          
          if (dist < 0.001) {
              gl_FragColor = texture2D(u_raw, u_tex_matrix * v_coord);
              return;
          }
          
          // ワープ効果：中心から外側に向かって光の筋
          vec4 color = vec4(0.0);
          float totalWeight = 0.0;
          
          // 放射状ブラー
          int samples = 16;
          for (int i = 0; i < 16; i++) {
              float t = float(i) / 15.0;
              float offset = t * u_streak_length * u_warp_strength * dist;
              vec2 samplePos = v_coord - dir * offset;
              
              float weight = 1.0 - t * 0.8;
              color += texture2D(u_raw, u_tex_matrix * samplePos) * weight;
              totalWeight += weight;
          }
          
          color /= totalWeight;
          
          // ワープ時の彩度・明るさブースト
          float boost = 1.0 + u_warp_strength * 0.5;
          color.rgb *= boost;
          
          // 彩度ブースト
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          color.rgb = mix(vec3(gray), color.rgb, u_saturation_boost);
          
          // 中心から外側に向かって青みを追加（ワープ感）
          color.rgb += vec3(0.0, 0.05, 0.15) * u_warp_strength * dist;
          
          gl_FragColor = color;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform1f({
      u_warp_strength: this.warpStrength,
      u_streak_length: this.streakLength,
      u_saturation_boost: this.saturationBoost,
    })
    program.uniform2fv({
      u_center: [this.centerX, this.centerY],
    })
  }

  /** ワープを開始（強度を0から1へ） */
  startWarp(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now()
      const animate = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        this.warpStrength = this.easeInQuad(progress)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      animate()
    })
  }

  /** ワープを終了（強度を1から0へ） */
  endWarp(duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      const startStrength = this.warpStrength
      const startTime = performance.now()
      const animate = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        this.warpStrength = startStrength * (1 - this.easeOutQuad(progress))
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      animate()
    })
  }

  private easeInQuad(t: number): number {
    return t * t
  }

  private easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t)
  }
}
