import { AttribList } from './attrib_list'
import * as glUtils from './utils'
import { TupleMap } from "~/lib/tuple-map"
import { mat2, mat3, mat4 } from 'gl-matrix'


export class Program {
    private vertShader: WebGLShader
    private fragShader: WebGLShader
    private name: WebGLProgram
    private attribLocationMemo = new Map<string, number>()
    private uniformLocationMemo = new Map<string, WebGLUniformLocation>()
    private refCount = 1

    private constructor(readonly gl: WebGLRenderingContext, private vertSource: string, private fragSource: string) {
        this.vertShader = this.createShader(vertSource, this.gl.VERTEX_SHADER)
        this.fragShader = this.createShader(fragSource, this.gl.FRAGMENT_SHADER)
        this.name = glUtils.nonNull(this.gl.createProgram())
        this.gl.attachShader(this.name, this.vertShader)
        this.gl.attachShader(this.name, this.fragShader)
        this.gl.linkProgram(this.name)
        if (!this.gl.getProgramParameter(this.name, this.gl.LINK_STATUS)) {
            throw `WebGL link error: ${this.gl.getProgramInfoLog(this.name)}`
        }
    }

    private retain() {
        ++this.refCount
        return this
    }

    private static cache = new TupleMap<[WebGLRenderingContext, string, string], Program>()

    static new(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
        const cachedProgram = Program.cache.get([gl, vertSource, fragSource])
        if (cachedProgram) {
            return cachedProgram.retain()
        }
        else {
            const program = new Program(gl, vertSource, fragSource)
            this.cache.set([gl, vertSource, fragSource], program)
            return program
        }
    }

    release() {
        if (--this.refCount == 0) {
            this.gl.deleteShader(this.fragShader)
            this.gl.deleteShader(this.vertShader)
            this.gl.deleteProgram(this.name)
            Program.cache.delete([this.gl, this.vertSource, this.fragSource])
        }
    }

    use() {
        this.gl.useProgram(this.name)
    }

    attribLocation(varName: string) {
        let location = this.attribLocationMemo.get(varName)
        if (location == undefined)
            location = this.gl.getAttribLocation(this.name, varName)
        if (location == -1)
            throw `unknown attribute: ${varName}`
        this.attribLocationMemo.set(varName, location)
        return location
    }

    uniformLocation(varName: string) {
        let location: WebGLUniformLocation | null | undefined = this.uniformLocationMemo.get(varName)
        if (location == undefined)
            location = this.gl.getUniformLocation(this.name, varName)
        if (location == null)
            throw `unknown uniform: ${varName}`
        this.uniformLocationMemo.set(varName, location)
        return location
    }

    enableAttribList(attribList: AttribList, cb: () => void) {
        this.use()
        attribList.enable(this, cb)
    }

    uniformMatrix4fv(matrices: { [name: string]: Float32Array | mat4 }, transpose: boolean = false) {
        for (let name in matrices) {
            let matrix = matrices[name]
            this.gl.uniformMatrix4fv(this.uniformLocation(name), transpose, matrix)
        }
    }

    uniformMatrix3fv(matrices: { [name: string]: Float32Array | mat3 }, transpose: boolean = false) {
        for (let name in matrices) {
            let matrix = matrices[name]
            this.gl.uniformMatrix3fv(this.uniformLocation(name), transpose, matrix)
        }
    }

    uniformMatrix2fv(matrices: { [name: string]: Float32Array | mat2 }, transpose: boolean = false) {
        for (let name in matrices) {
            let matrix = matrices[name]
            this.gl.uniformMatrix2fv(this.uniformLocation(name), transpose, matrix)
        }
    }

    uniform1f(vars: { [name: string]: number }) {
        for (let name in vars) {
            this.gl.uniform1f(this.uniformLocation(name), vars[name])
        }
    }

    uniform1i(vars: { [name: string]: number }) {
        for (let name in vars) {
            this.gl.uniform1i(this.uniformLocation(name), vars[name])
        }
    }

    uniform2fv(vars: { [name: string]: number[] }) {
        for (let name in vars) {
            this.gl.uniform2fv(this.uniformLocation(name), vars[name])
        }
    }

    uniform3fv(vars: { [name: string]: number[] }) {
        for (let name in vars) {
            this.gl.uniform3fv(this.uniformLocation(name), vars[name])
        }
    }

    uniform4fv(vars: { [name: string]: number[] }) {
        for (let name in vars) {
            this.gl.uniform4fv(this.uniformLocation(name), vars[name])
        }
    }

    private createShader(source: string, type: number): WebGLShader {
        let shader = this.gl.createShader(type)
        if (!shader) {
            throw `WebGL createShader error: ${this.gl.getError()}`
        }
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw `WebGL shader compile error: ${this.gl.getShaderInfoLog(shader)}\nsource:\n${glUtils.withLineNumber(source)}`
        }
        return glUtils.nonNull(shader)
    }

}