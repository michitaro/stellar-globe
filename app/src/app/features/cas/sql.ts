import { RectangularRegion } from "../regions/regionsSlice"

type Options = {
  sql: string
  region?: RectangularRegion
}

export function expandCasSql({
  sql,
  region,
}: Options) {
  return sql
    .replace(/\$coord_in_selection_box\b/g, region ? boxSearch(region) : `'t'`)
}

function boxSearch(region: RectangularRegion) {
  const { minRa, maxRa, minDec, maxDec } = region
  return `boxSearch(coord, ${rad2deg(minRa)}, ${rad2deg(maxRa)}, ${rad2deg(minDec)}, ${rad2deg(maxDec)})`
}

function rad2deg(value: number) {
  return value * 180 / Math.PI
}
