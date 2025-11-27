import { AttribList, Program, Texture } from '../lib/gl-wrapper'
import { CaptureTarget } from '../globe/CaptureTarget'
import { nonNull } from '../lib/gl-wrapper/utils'

// Globe型のインポート（循環参照を避けるため型のみ）
import type { Globe } from '../globe'

// VisualEffectParamsを再エクスポート
export { VisualEffectParams, DistortionParams } from './VisualEffectParams'

// エフェクトの再エクスポート
export { PlanetariumEffect } from './PlanetariumEffect'
export { MotionBlurEffect } from './MotionBlurEffect'
export { AfterimageEffect } from './AfterimageEffect'
export { GlowEffect } from './GlowEffect'
export { GaussianBlurEffect } from './GaussianBlurEffect'
export { BloomEffect } from './BloomEffect'
export { FrostedGlassEffect } from './FrostedGlassEffect'
export { RippleEffect } from './RippleEffect'
export { WarpEffect } from './WarpEffect'
export { PassThroughEffect } from './PassThroughEffect'
export { TransitionEffect } from './TransitionEffect'

// 内部インポート（VisualEffectRendererで使用）
import { VisualEffectParams } from './VisualEffectParams'


/**
 * ビジュアルエフェクトのレンダラー
 * シーンをオフスクリーンにレンダリングし、エフェクトを適用して画面に描画する
 */
export class VisualEffectRenderer {
  private attribList: AttribList
  private program: Program
  private captureTarget: CaptureTarget
  /** 前フレームを保持するテクスチャ（残像効果用） */
  private previousFrameTexture: Texture | null = null
  private previousFrameBuffer: WebGLFramebuffer | null = null
  private previousFrameWidth = 0
  private previousFrameHeight = 0
  private hasPreviousFrame = false
  /** スナップショットテクスチャ（トランジション効果用） */
  private snapshotTexture: Texture | null = null
  private snapshotWidth = 0
  private snapshotHeight = 0
  private hasSnapshot = false

  constructor(
    readonly gl: WebGL2RenderingContext,
    readonly params: VisualEffectParams,
    readonly globe?: Globe,
  ) {
    this.captureTarget = new CaptureTarget(gl)
    this.attribList = new AttribList(gl, {
      members: [{
        name: "a_coord",
        nComponents: 2,
      }],
      array: new Float32Array([0, 0, /**/ 1, 0, /**/ 1, 1, /**/ 0, 0,  /**/ 1, 1, /**/ 0, 1]),
    })
    const vertextShader = `
      attribute  vec2   a_coord;
      varying    vec2   v_coord;
      
      void main(void) {
          gl_Position = vec4(2. * a_coord - vec2(1.), 0., 1.);
          v_coord = a_coord;
      }
    `
    this.program = Program.new(gl, vertextShader, params.fragShader())
    
    // 前フレームテクスチャを使用するエフェクトの場合は初期化
    if (this.usesPreviousFrame()) {
      this.initPreviousFrameResources()
    }
    
    // スナップショットを使用するエフェクトの場合は初期化
    if (this.usesSnapshot()) {
      this.initSnapshotResources()
    }
  }

  /** エフェクトが前フレームテクスチャを使用するかどうか */
  private usesPreviousFrame(): boolean {
    return 'usesPreviousFrame' in this.params && (this.params as any).usesPreviousFrame === true
  }

  /** エフェクトがスナップショットを使用するかどうか */
  private usesSnapshot(): boolean {
    return 'usesSnapshot' in this.params && (this.params as any).usesSnapshot === true
  }

  /** 前フレーム用のリソースを初期化 */
  private initPreviousFrameResources() {
    const gl = this.gl
    this.previousFrameTexture = new Texture(gl)
    this.previousFrameBuffer = nonNull(gl.createFramebuffer())
  }

  /** スナップショット用のリソースを初期化 */
  private initSnapshotResources() {
    const gl = this.gl
    this.snapshotTexture = new Texture(gl)
  }

  /** 前フレーム用のリソースを解放 */
  private releasePreviousFrameResources() {
    if (this.previousFrameTexture) {
      this.previousFrameTexture.release()
      this.previousFrameTexture = null
    }
    if (this.previousFrameBuffer) {
      this.gl.deleteFramebuffer(this.previousFrameBuffer)
      this.previousFrameBuffer = null
    }
  }

  /** スナップショット用のリソースを解放 */
  private releaseSnapshotResources() {
    if (this.snapshotTexture) {
      this.snapshotTexture.release()
      this.snapshotTexture = null
    }
    this.hasSnapshot = false
  }

  /** キャンバスのアスペクト比を取得 */
  get aspectRatio(): number {
    return this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
  }

  /** キャンバスの幅（ピクセル） */
  get width(): number {
    return this.gl.drawingBufferWidth
  }

  /** キャンバスの高さ（ピクセル） */
  get height(): number {
    return this.gl.drawingBufferHeight
  }

  release() {
    this.attribList.release()
    this.program.release()
    this.captureTarget.release()
    this.releasePreviousFrameResources()
    this.releaseSnapshotResources()
  }

  /**
   * 現在の画面をスナップショットとして保存
   * トランジション効果で使用する
   */
  captureSnapshot() {
    if (!this.snapshotTexture) {
      this.initSnapshotResources()
    }
    
    const gl = this.gl
    const width = gl.drawingBufferWidth
    const height = gl.drawingBufferHeight
    
    // サイズが変わった場合はテクスチャを再作成
    if (width !== this.snapshotWidth || height !== this.snapshotHeight) {
      gl.bindTexture(gl.TEXTURE_2D, this.snapshotTexture!.name)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.bindTexture(gl.TEXTURE_2D, null)
      
      this.snapshotWidth = width
      this.snapshotHeight = height
    }
    
    // 現在の画面をテクスチャにコピー
    gl.bindTexture(gl.TEXTURE_2D, this.snapshotTexture!.name)
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, width, height)
    gl.bindTexture(gl.TEXTURE_2D, null)
    
    this.hasSnapshot = true
  }

  /**
   * スナップショットをクリア
   */
  clearSnapshot() {
    this.hasSnapshot = false
  }

  pipeAndDraw(cb: () => void) {
    this.captureTarget.capture(cb)
    this.draw()
    
    // 前フレームテクスチャを使用するエフェクトの場合、現在のフレームを保存
    if (this.usesPreviousFrame()) {
      this.savePreviousFrame()
    }
  }

  /** 現在のフレームを前フレームテクスチャにコピー */
  private savePreviousFrame() {
    const gl = this.gl
    if (!this.previousFrameTexture || !this.previousFrameBuffer) return
    
    const width = gl.drawingBufferWidth
    const height = gl.drawingBufferHeight
    
    // サイズが変わった場合はテクスチャを再作成
    if (width !== this.previousFrameWidth || height !== this.previousFrameHeight) {
      gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture.name)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.bindTexture(gl.TEXTURE_2D, null)
      
      this.previousFrameWidth = width
      this.previousFrameHeight = height
    }
    
    // 現在の画面をテクスチャにコピー
    gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture.name)
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, width, height)
    gl.bindTexture(gl.TEXTURE_2D, null)
    
    this.hasPreviousFrame = true
  }

  private draw() {
    const { gl, program, captureTarget } = this
    program.use()
    program.uniformMatrix2fv({
      u_tex_matrix: captureTarget.texMatrix(),
    })
    this.attribList.enable(program, () => {
      program.uniform1i({
        u_raw: 0,
      })
      
      // 前フレームテクスチャを使用する場合
      if (this.usesPreviousFrame() && this.previousFrameTexture) {
        program.uniform1i({
          u_previous_frame: 1,
        })
        program.uniform1f({
          u_has_previous: this.hasPreviousFrame ? 1.0 : 0.0,
        })
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture.name)
      }
      
      // スナップショットを使用する場合
      if (this.usesSnapshot() && this.snapshotTexture) {
        program.uniform1i({
          u_snapshot: 2,
        })
        program.uniform1f({
          u_has_snapshot: this.hasSnapshot ? 1.0 : 0.0,
        })
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, this.snapshotTexture.name)
      }
      
      this.params.setUniforms(program)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, captureTarget.rawOutput.name)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      
      // テクスチャをアンバインド
      gl.activeTexture(gl.TEXTURE2)
      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, null)
    })
  }
}
