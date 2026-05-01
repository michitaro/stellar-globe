import * as healpix from '@hscmap/healpix'
import { vec3 } from 'gl-matrix'
import { V3 } from '~/types'
import { clip, square } from '~/utils/math'
import { Tract } from './tract'

const LINEAR_SCAN_TRACT_THRESHOLD = 32
const TARGET_TRACTS_PER_PIXEL = 8
const MIN_INDEX_ORDER = 1
const MAX_INDEX_ORDER = 8
const MAX_INDEXED_RADIUS = Math.PI / 2

export class TractSpatialIndex {
  private readonly buckets = new Map<number, Tract[]>()
  private readonly maxTractFov: number
  private readonly nside: number

  constructor(
    readonly tracts: readonly Tract[],
  ) {
    this.maxTractFov = tracts.reduce((max, tract) => Math.max(max, tract.fov), 0)
    const order = indexOrder(tracts.length)
    this.nside = 1 << order

    if (tracts.length <= LINEAR_SCAN_TRACT_THRESHOLD) {
      return
    }

    for (const tract of tracts) {
      const pixel = healpix.vec2pix_nest(this.nside, tract.refPoint)
      const bucket = this.buckets.get(pixel)
      if (bucket) {
        bucket.push(tract)
      } else {
        this.buckets.set(pixel, [tract])
      }
    }
  }

  visible(center: V3, arc: number, cb: (tract: Tract) => void) {
    if (
      this.tracts.length <= LINEAR_SCAN_TRACT_THRESHOLD ||
      arc + this.maxTractFov > MAX_INDEXED_RADIUS
    ) {
      this.scanAll(center, arc, cb)
      return
    }

    const done = new Set<number>()
    healpix.query_disc_inclusive_nest(
      this.nside,
      center,
      arc + this.maxTractFov,
      (pixel) => {
        const bucket = this.buckets.get(pixel)
        if (!bucket) {
          return
        }
        for (const tract of bucket) {
          if (done.has(tract.id)) {
            continue
          }
          done.add(tract.id)
          if (isVisible(center, arc, tract)) {
            cb(tract)
          }
        }
      },
    )
  }

  private scanAll(center: V3, arc: number, cb: (tract: Tract) => void) {
    for (const tract of this.tracts) {
      if (isVisible(center, arc, tract)) {
        cb(tract)
      }
    }
  }
}

function isVisible(center: V3, arc: number, tract: Tract) {
  return vec3.sqrDist(center, tract.refPoint) <= square(arc + tract.fov)
}

function indexOrder(tractCount: number) {
  if (tractCount <= LINEAR_SCAN_TRACT_THRESHOLD) {
    return MIN_INDEX_ORDER
  }
  const order = Math.ceil(Math.log(tractCount / (12 * TARGET_TRACTS_PER_PIXEL)) / Math.log(4))
  return clip(order, MIN_INDEX_ORDER, MAX_INDEX_ORDER)
}
