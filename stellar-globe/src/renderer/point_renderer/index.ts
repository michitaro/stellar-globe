import { AttribList, Program, utils as glUtils } from '~/lib/gl-wrapper'
import { View } from "~/view"


export class Point {
  constructor(public position: V3, public color: V4, public size: number) { }
}

import { V3, V4 } from "~/types"
import shaderFrag from './frag.glsl?raw'
import shaderVert from './vert.glsl?raw'


export class PointRenderer {
  private program: Program
  private attribList: AttribList

  darkenSmallPoint = true
  minSize = 3

  private _points: Point[] = []
  get points() { return this.points }
  set points(points: Point[]) {
    this._points = points
    this.needsUpdatePoints = true
  }

  constructor(private readonly gl: WebGLRenderingContext) {
    this.program = Program.new(gl,
      shaderVert,
      shaderFrag,
    )
    this.attribList = new AttribList(gl, {
      members: [
        { name: 'a_position', nComponents: 3 },
        { name: 'a_size', nComponents: 1 },
        { name: 'a_color', nComponents: 4 },
      ],
    })
  }

  release() {
    this.attribList.release()
    this.program.release()
  }

  private needsUpdatePoints = false

  render(view: View, alpha = 1) {
    if (this.needsUpdatePoints) {
      this.updateVBO()
      this.needsUpdatePoints = false
    }

    if (this.attribList.vertexCount === 0) {
      return
    }

    if (alpha <= 0) {
      return
    }

    const camera = view.mvp

    const gl = this.gl
    const p = this.program
    p.enableAttribList(this.attribList, () => {
      p.uniformMatrix4fv({ u_pvMatrix: camera.pv })
      p.uniform1f({
        u_alpha: alpha,
        u_fovy: camera.fovy,
        u_bufferHeight: gl.drawingBufferHeight,
        u_minSize: this.minSize,
      })
      p.uniform1i({ u_darkenSmallPoint: this.darkenSmallPoint ? 1 : 0 })
      glUtils.enable(gl, [gl.BLEND], () => {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.drawArrays(gl.POINTS, 0, this.attribList.vertexCount)
      })
    })
  }

  private updateVBO() {
    /*
      { name: 'a_position', nComponents: 3 },
      { name: 'a_size', nComponents: 1 },
      { name: 'a_color', nComponents: 4 },
    */
    const attrs: number[] = []
    const points = this._points
    for (const p of points) {
      attrs.push(...p.position, p.size, ...p.color)
    }
    this.attribList.setData({ array: new Float32Array(attrs) })
  }

  _setArray(array: Float32Array) {
    this._points = []
    this.attribList.setData({ array: new Float32Array(array) })
  }
}
