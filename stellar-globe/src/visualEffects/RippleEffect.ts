import { Program } from '../lib/gl-wrapper'
import { VisualEffectParams } from '.'


/**
 * 波紋エフェクト
 * 水面の波紋のような変形効果
 */
export class RippleEffect extends VisualEffectParams {
  /** 波紋の中心X（0-1） */
  centerX = 0.5
  /** 波紋の中心Y（0-1） */
  centerY = 0.5
  /** 波紋の振幅 */
  amplitude = 0.02
  /** 波紋の周波数 */
  frequency = 20.0
  /** 波紋の速度 */
  speed = 2.0
  /** 時間（アニメーション用） */
  time = 0

  fragShader() {
    return `
      precision mediump float;
      uniform sampler2D     u_raw;
      uniform mat2          u_tex_matrix;
      uniform vec2          u_center;
      uniform float         u_amplitude;
      uniform float         u_frequency;
      uniform float         u_time;
      varying vec2          v_coord;

      void main(void) {
          vec2 center = u_center;
          vec2 uv = v_coord - center;
          float dist = length(uv);
          
          // 波紋の計算
          float wave = sin(dist * u_frequency - u_time) * u_amplitude;
          wave *= exp(-dist * 2.0); // 中心から離れるほど減衰
          
          // 変位を適用
          vec2 displacement = normalize(uv) * wave;
          if (dist < 0.001) displacement = vec2(0.0);
          
          vec2 texCoord = u_tex_matrix * (v_coord + displacement);
          vec4 color = texture2D(u_raw, texCoord);
          
          gl_FragColor = color;
      }
    `
  }

  setUniforms(program: Program) {
    program.uniform2fv({
      u_center: [this.centerX, this.centerY],
    })
    program.uniform1f({
      u_amplitude: this.amplitude,
      u_frequency: this.frequency,
      u_time: this.time,
    })
  }

  update(deltaTime: number) {
    this.time += deltaTime * 0.001 * this.speed
  }
}
