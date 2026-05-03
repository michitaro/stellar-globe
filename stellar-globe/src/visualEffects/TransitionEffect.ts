import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from './VisualEffectParams'


/**
 * トランジションエフェクト
 * 2つの画像間でdissolve、ワイプ、渦巻きなどの遷移効果を実現
 * 
 * 注意: このエフェクトはVisualEffectRendererのスナップショット機能を使用します。
 * 事前にVisualEffectRenderer.captureSnapshot()でスナップショットを取得してください。
 */
export class TransitionEffect extends VisualEffectParams {
  /** トランジションの進行度（0-1、0: スナップショット、1: 現在のフレーム） */
  progress = 0.0
  
  /** トランジションのタイプ */
  type: 'dissolve' | 'wipe' | 'swirl' | 'zoom' | 'slide' = 'dissolve'
  
  /** 渦巻きの強度（swirlタイプで使用） */
  swirlStrength = 3.0
  
  /** ワイプの方向（wipeタイプで使用、ラジアン） */
  wipeAngle = 0.0
  
  /** ズームの量（zoomタイプで使用） */
  zoomAmount = 2.0
  
  /** スライドの方向（slideタイプで使用、ラジアン） */
  slideAngle = 0.0
  
  /** アスペクト比 */
  aspectRatio = 1.0
  
  /** スナップショットテクスチャを使用するフラグ */
  readonly usesSnapshot = true

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform sampler2D     u_snapshot;
      uniform mat2          u_tex_matrix;
      uniform float         u_progress;
      uniform int           u_type;
      uniform float         u_swirl_strength;
      uniform float         u_wipe_angle;
      uniform float         u_zoom_amount;
      uniform float         u_slide_angle;
      uniform float         u_aspect_ratio;
      uniform float         u_has_snapshot;
      varying vec2          v_coord;
      
      #define TYPE_DISSOLVE 0
      #define TYPE_WIPE 1
      #define TYPE_SWIRL 2
      #define TYPE_ZOOM 3
      #define TYPE_SLIDE 4
      
      #define M_PI 3.14159265359

      bool isInsideUnit(vec2 coord) {
          return coord.x >= 0.0 && coord.x <= 1.0 && coord.y >= 0.0 && coord.y <= 1.0;
      }

      void main(void) {
          vec2 texCoord = u_tex_matrix * v_coord;
          vec4 currentColor = texture2D(u_raw, texCoord);
          
          // スナップショットがない場合は現在のフレームをそのまま表示
          if (u_has_snapshot < 0.5) {
              gl_FragColor = currentColor;
              return;
          }
          
          vec4 snapshotColor = texture2D(u_snapshot, texCoord);
          float t = u_progress;
          
          // Dissolve（クロスフェード）
          if (u_type == TYPE_DISSOLVE) {
              gl_FragColor = mix(snapshotColor, currentColor, t);
              return;
          }
          
          // Wipe（指定方向へのワイプ）
          if (u_type == TYPE_WIPE) {
              vec2 center = vec2(0.5);
              vec2 dir = vec2(cos(u_wipe_angle), sin(u_wipe_angle));
              float d = dot(v_coord - center, dir) + 0.5;
              float edge = smoothstep(t - 0.05, t + 0.05, d);
              gl_FragColor = mix(currentColor, snapshotColor, edge);
              return;
          }
          
          // Swirl（渦巻き）
          if (u_type == TYPE_SWIRL) {
              vec2 center = vec2(0.5);
              vec2 uv = v_coord - center;
              
              // アスペクト比を補正
              uv.y *= u_aspect_ratio;
              
              float dist = length(uv);
              float angle = atan(uv.y, uv.x);
              
              // 渦巻きの強度をtで制御
              float swirlAmount = u_swirl_strength * (1.0 - t) * (1.0 - dist);
              angle += swirlAmount;
              
              // 回転後の座標
              vec2 swirlCoord = center + dist * vec2(cos(angle), sin(angle) / u_aspect_ratio);
              swirlCoord = clamp(swirlCoord, vec2(0.001), vec2(0.999));
              
              // 両方のテクスチャをサンプリング
              vec2 swirlTexCoord = u_tex_matrix * swirlCoord;
              vec4 swirlCurrent = texture2D(u_raw, swirlTexCoord);
              vec4 swirlSnapshot = texture2D(u_snapshot, swirlTexCoord);
              
              gl_FragColor = mix(swirlSnapshot, swirlCurrent, t);
              return;
          }
          
          // Zoom（ズームトランジション）
          if (u_type == TYPE_ZOOM) {
              vec2 center = vec2(0.5);
              
              // スナップショット: ズームアウト
              float snapshotScale = 1.0 + (u_zoom_amount - 1.0) * t;
              vec2 snapshotCoord = center + (v_coord - center) * snapshotScale;
              snapshotCoord = clamp(snapshotCoord, vec2(0.001), vec2(0.999));
              vec4 zoomedSnapshot = texture2D(u_snapshot, u_tex_matrix * snapshotCoord);
              
              // 現在: ズームイン
              float currentScale = u_zoom_amount - (u_zoom_amount - 1.0) * t;
              vec2 currentCoord = center + (v_coord - center) * currentScale;
              currentCoord = clamp(currentCoord, vec2(0.001), vec2(0.999));
              vec4 zoomedCurrent = texture2D(u_raw, u_tex_matrix * currentCoord);
              
              gl_FragColor = mix(zoomedSnapshot, zoomedCurrent, t);
              return;
          }
          
          // Slide（スライドトランジション）
          if (u_type == TYPE_SLIDE) {
              vec2 dir = vec2(cos(u_slide_angle), sin(u_slide_angle));
              
              // スナップショット: 進行方向にスライドアウト
              vec2 snapshotCoord = v_coord + dir * t;
              bool hasSlidSnapshot = isInsideUnit(snapshotCoord);
              vec4 slidSnapshot = snapshotColor;
              if (hasSlidSnapshot) {
                  slidSnapshot = texture2D(u_snapshot, u_tex_matrix * snapshotCoord);
              }
              
              // 現在: 反対側からスライドイン
              vec2 currentCoord = v_coord - dir * (1.0 - t);
              bool hasSlidCurrent = isInsideUnit(currentCoord);
              vec4 slidCurrent = currentColor;
              if (hasSlidCurrent) {
                  slidCurrent = texture2D(u_raw, u_tex_matrix * currentCoord);
              }
              
              // 境界を決定
              float boundary = dot(v_coord - vec2(0.5), dir) + 0.5;
              if (boundary < t) {
                  gl_FragColor = hasSlidCurrent ? slidCurrent : snapshotColor;
              } else {
                  gl_FragColor = hasSlidSnapshot ? slidSnapshot : currentColor;
              }
              return;
          }
          
          // デフォルト: dissolve
          gl_FragColor = mix(snapshotColor, currentColor, t);
      }
    `
  }

  setUniforms(program: Program) {
    const typeMap: Record<string, number> = {
      'dissolve': 0,
      'wipe': 1,
      'swirl': 2,
      'zoom': 3,
      'slide': 4,
    }
    
    program.uniform1f({
      u_progress: this.progress,
      u_swirl_strength: this.swirlStrength,
      u_wipe_angle: this.wipeAngle,
      u_zoom_amount: this.zoomAmount,
      u_slide_angle: this.slideAngle,
      u_aspect_ratio: this.aspectRatio,
    })
    program.uniform1i({
      u_type: typeMap[this.type] ?? 0,
    })
  }
}
