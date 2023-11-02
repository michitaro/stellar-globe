import { V3 } from "~/types"


const defaultFilters = ['HSC-I', 'HSC-R', 'HSC-G']

function sdssTrueColor() {
  return {
    type: 'sdssTrueColor' as const,
    filters: defaultFilters,
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
    type: 'simpleRgb' as const,
    filters: defaultFilters,
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
    type: 'simpleColorMatrix' as const,
    filters: defaultFilters,
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
    type: 'sdssTrueColorMatrix' as const,
    filters: defaultFilters,
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
  [K in SspTileMixerType]: ReturnType<(typeof defaultParams)[K]>
}

export type SspTileParams = ParamsMap[SspTileMixerType]

export type SspTileParamsOf<
  T extends SspTileMixerType
> = T extends "simpleRgb" ? ReturnType<(typeof defaultParams)[T]>["simpleRgb"] :
  T extends "simpleColorMatrix" ? ReturnType<(typeof defaultParams)[T]>["simpleColorMatrix"] :
  T extends "sdssTrueColor" ? ReturnType<(typeof defaultParams)[T]>["sdssTrueColor"] :
  T extends "sdssTrueColorMatrix" ? ReturnType<(typeof defaultParams)[T]>["sdssTrueColorMatrix"] : never


export function sspTileDefaultParams(type: SspTileMixerType = 'sdssTrueColor'): SspTileParams {
  return {
    ...defaultParams[type](),
  }
}

export function sspTileParamsAssertType<T extends SspTileMixerType>(params: SspTileParams, type: T): asserts params is ParamsMap[T] {
  if (params.type !== type) {
    throw new Error(`SspTileLayerParams: type mismatch: expected=${type}, but actual: ${params.type}`)
  }
}

type MatrixColor = {
  enabled: boolean
  value: V3
}
