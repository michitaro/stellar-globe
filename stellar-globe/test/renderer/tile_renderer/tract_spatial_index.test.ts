import { describe, expect, it } from 'vitest'
import { Tract } from '../../../src/renderer/tile_renderer/tract'
import { TractSpatialIndex } from '../../../src/renderer/tile_renderer/tract_spatial_index'

describe('TractSpatialIndex', () => {
  it('視野近傍の tract だけを返す', () => {
    const near = makeTract(0, 0)
    const edge = makeTract(2, 0)
    const far = makeTract(30, 0)
    const index = new TractSpatialIndex([near, edge, far])
    const visible = new Set<number>()

    index.visible(near.refPoint, deg2rad(1), tract => {
      visible.add(tract.id)
    })

    expect(visible).toEqual(new Set([near.id, edge.id]))
  })

  it('経度 0 度またぎでも tract を取りこぼさない', () => {
    const center = makeTract(359.5, 0)
    const wrapped = makeTract(1, 0)
    const far = makeTract(40, 0)
    const index = new TractSpatialIndex([center, wrapped, far])
    const visible = new Set<number>()

    index.visible(center.refPoint, deg2rad(1), tract => {
      visible.add(tract.id)
    })

    expect(visible).toEqual(new Set([center.id, wrapped.id]))
  })
})

function makeTract(raDeg: number, decDeg: number) {
  return new Tract(
    4096,
    4096,
    deg2rad(raDeg),
    deg2rad(decDeg),
    2048.5,
    2048.5,
    [
      deg2rad(-0.0000466667),
      0,
      0,
      deg2rad(0.0000466667),
    ],
  )
}

function deg2rad(deg: number) {
  return deg * Math.PI / 180
}
