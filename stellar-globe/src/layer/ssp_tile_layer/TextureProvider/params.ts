import { V3 } from "~/types"


function sdssTrueColor() {
  return {
    sdssTrueColor: {
      beta: Math.exp(10),
      a: 1,
      bias: 0.05,
      b0: 0,
    },
  }
}

function simpleRgb() {
  return {
    simpleRgb: {
      beta: Math.exp(10),
      a: 1,
      bias: 0.05,
      b0: 0,
    },
  }
}

function simpleColorMatrix() {
  return {
    simpleColorMatrix: {
      colors: [
        { enabled: true, value: [1, 0, 0] },
        { enabled: true, value: [0, 1, 0] },
        { enabled: true, value: [0, 0, 1] },
      ] as MatrixColor[],
      beta: Math.exp(10),
      a: 1,
      bias: 0.05,
      b0: 0,
    },
  }
}

function sdssTrueColorMatrix() {
  return {
    sdssTrueColorMatrix: {
      colors: [
        { enabled: true, value: [1, 0, 0] },
        { enabled: true, value: [0, 1, 0] },
        { enabled: true, value: [0, 0, 1] },
      ] as MatrixColor[],
      beta: Math.exp(10),
      a: 1,
      bias: 0.05,
      b0: 0,
    },
  }
}

const defaultParams = {
  simpleRgb,
  simpleColorMatrix,
  sdssTrueColor,
  sdssTrueColorMatrix,
}


export type SspTileMixerType = keyof typeof defaultParams

type ParamsMap = {
  [K in SspTileMixerType]: ReturnType<(typeof defaultParams)[K]> & { type: K, filters: string[] }
}

export type SspTileParams = ParamsMap[SspTileMixerType]

export type SspTileParamsOf<
  T extends SspTileMixerType,
  U extends keyof ReturnType<(typeof defaultParams)[T]> = keyof ReturnType<(typeof defaultParams)[T]>
> = ReturnType<(typeof defaultParams)[T]>[U]


export function sspTileDefaultParams(type: SspTileMixerType = 'sdssTrueColor'): SspTileParams {
  // @ts-ignore
  return {
    type,
    filters: ['HSC-I', 'HSC-R', 'HSC-G'],
    ...defaultParams[type](),
  }
}

// export function sspTileDefaultParams<T extends SspTileMixerType>(type: T) {
//   return {
//     type: type as T,
//     filters: ['HSC-I', 'HSC-R', 'HSC-G'],
//     ...defaultParams[type]() as ReturnType<(typeof defaultParams)[T]>,
//   }
// }


export function sspTileParamsAssertType<T extends SspTileMixerType>(params: SspTileParams, type: T): asserts params is ParamsMap[T] {
  if (params.type !== type) {
    throw new Error(`SspTileLayerParams: type mismatch: expected=${type}, but actual: ${params.type}`)
  }
}


type MatrixColor = {
  enabled: boolean
  value: V3
}
