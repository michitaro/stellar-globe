import { Dummy } from "~/utils/dummy_class"
import { nonNull } from "./utils"


const pool: Map<string, HTMLCanvasElement[]> = new Map()


function canvasList(options: WebGLContextAttributes) {
    const key = contextOptions2key(options)
    if (!pool.has(key)) {
        pool.set(key, [])
    }
    return pool.get(key)!
}


export function pull(options: WebGLContextAttributes, { jsdomTest }: { jsdomTest: boolean }) {
    const list = canvasList(options)
    if (list.length === 0) {
        list.push(createCanvas())
    }
    const canvas = list.pop()!
    const gl: WebGLRenderingContext = jsdomTest ? (new Dummy() as any) : nonNull(canvas.getContext('webgl', options))
    const release = () => {
        list.push(canvas)
    }
    return { canvas, gl, release }
}


function createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.style.backgroundColor = '#007'
    return canvas
}


function contextOptions2key(opt: any) {
    return JSON.stringify(Object.keys(opt).sort().map(k => [k, opt[k]]))
}
