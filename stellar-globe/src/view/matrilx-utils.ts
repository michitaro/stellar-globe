import { mat3, mat4 } from 'gl-matrix'

export function composite(scales: number[], matrices: Float32Array[]): Float32Array {
  const m = mat4.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  for (let i = 0; i < scales.length; ++i) {
    mat4.multiplyScalarAndAdd(m, m, matrices[i] as mat4, scales[i])
  }
  // @ts-ignore
  return m
}

export type CameraMode = 'GNOMONIC' | 'STEREOGRAPHIC' | 'FLOATING_EYE'


export type CameraParams = {
  aspectRatio: number
  fovy: number
  mode: CameraMode
  theta: number,
  phi: number,
  roll: number,
  za: number, // zenith alpha
  zd: number, // zenith delta
  zp: number, // rotation angle around zenith pole
}

function mulZenith4(m: mat4, a: number, d: number, p: number) {
  // mat4.rotateZ(m, m, -p)
  // mat4.rotateY(m, m, -(Math.PI / 2 - d))
  // mat4.rotateZ(m, m, -a)
  // return m
  const cA = Math.cos(a)
  const sA = Math.sin(a)
  const cP = Math.cos(p)
  const sP = Math.sin(p)
  const cD = Math.cos(d)
  const sD = Math.sin(d)
  mat4.mul(m, m, mat4.fromValues(
    cA * cP * sD - sA * sP, -cA * sD * sP - cP * sA, cA * cD, 0,
    cA * sP + cP * sA * sD, cA * cP - sA * sD * sP, cD * sA, 0,
    -cD * cP, cD * sP, sD, 0,
    0, 0, 0, 1))
  return m
}

export function zenith3(a: number, d: number, p: number) {
  const cA = Math.cos(a)
  const sA = Math.sin(a)
  const cP = Math.cos(p)
  const sP = Math.sin(p)
  const cD = Math.cos(d)
  const sD = Math.sin(d)
  return mat3.fromValues(
    cA * cP * sD - sA * sP, -cA * sD * sP - cP * sA, cA * cD,
    cA * sP + cP * sA * sD, cA * cP - sA * sD * sP, cD * sA,
    -cD * cP, cD * sP, sD)
}

export function izenith3(a: number, d: number, p: number) {
  const cA = Math.cos(a)
  const sA = Math.sin(a)
  const cP = Math.cos(p)
  const sP = Math.sin(p)
  const cD = Math.cos(d)
  const sD = Math.sin(d)
  return mat3.fromValues(
    cA * cP * sD - sA * sP, cA * sP + cP * sA * sD, -cD * cP,
    -cA * sD * sP - cP * sA, cA * cP - sA * sD * sP, cD * sP,
    cA * cD, cD * sA, sD,
  )
}

export function izenith4(a: number, d: number, p: number) {
  const cA = Math.cos(a)
  const sA = Math.sin(a)
  const cP = Math.cos(p)
  const sP = Math.sin(p)
  const cD = Math.cos(d)
  const sD = Math.sin(d)
  return mat4.fromValues(
    cA * cP * sD - sA * sP, cA * sP + cP * sA * sD, -cD * cP, 0,
    -cA * sD * sP - cP * sA, cA * cP - sA * sD * sP, cD * sP, 0,
    cA * cD, cD * sA, sD, 0,
    0, 0, 0, 1,
  )
}

function zenith2adp(m: mat3) {
  const d = Math.asin(m[8])
  const a = Math.atan2(m[5], m[2])
  const p = Math.atan2(m[7], -m[6])
  return [a, d, p]
}

export function normalizeZenith(a: number, d: number, z: number) {
  return zenith2adp(zenith3(a, d, z))
}

export function cameraMatrix(p: CameraParams) {
  const out = mat4.create()
  look(out, p)
  mulZenith4(out, p.za, p.zd, p.zp)
  return out
}

function look(out: mat4, p: CameraParams) {
  const fovy = p.fovy
  const ar = p.aspectRatio
  const cA = Math.cos(p.phi)
  const sA = Math.sin(p.phi)
  const cD = Math.cos(p.theta)
  const sD = Math.sin(p.theta)
  const sR = Math.sin(p.roll)
  const cR = Math.cos(p.roll)
  switch (p.mode) {
    case 'GNOMONIC':
      return mat4.set(out,
        (cA * sD * sR + cR * sA) / (ar * fovy), (-cA * cR * sD + sA * sR) / fovy, 41 * cA * cD / 39, cA * cD,
        (-cA * cR + sA * sD * sR) / (ar * fovy), -(cA * sR + cR * sA * sD) / fovy, 41 * cD * sA / 39, cD * sA,
        -cD * sR / (ar * fovy), cD * cR / fovy, 41 * sD / 39, sD,
        0, 0, -4 / 39, 0)
    case 'STEREOGRAPHIC':
      return mat4.set(out,
        2 * (cA * sD * sR + cR * sA) / (ar * fovy), 2 * (-cA * cR * sD + sA * sR) / fovy, 13 * cA * cD / 11, cA * cD,
        // tslint:disable-next-line:max-line-length
        2 * (-cA * cR + sA * sD * sR) / (ar * fovy), -(2 * cA * sR + 2 * cR * sA * sD) / fovy, 13 * cD * sA / 11, cD * sA,
        -2 * cD * sR / (ar * fovy), 2 * cD * cR / fovy, 13 * sD / 11, sD,
        0, 0, 7 / 11, 1)
    case 'FLOATING_EYE':
      return mat4.set(out,
        // tslint:disable-next-line:max-line-length
        (fovy + 1) * (cA * sD * sR + cR * sA) / (ar * fovy), (fovy + 1) * (-cA * cR * sD + sA * sR) / fovy, 41 * cA * cD / 39, cA * cD,
        // tslint:disable-next-line:max-line-length
        (fovy + 1) * (-cA * cR + sA * sD * sR) / (ar * fovy), -(fovy + 1) * (cA * sR + cR * sA * sD) / fovy, 41 * cD * sA / 39, cD * sA,
        -cD * sR * (fovy + 1) / (ar * fovy), cD * cR * (fovy + 1) / fovy, 41 * sD / 39, sD,
        0, 0, 41 * fovy / 39 - 20 / 39, fovy,
      )
  }
}
