import { MarkerType, SkyCoord, V4, markerTypes } from "@stellar-globe/stellar-globe"
import { hexToRgba } from "../../../common/utils/hexToRgba"
import { Marker } from "../catalog/catalogSlice"

export type CasPreview = {
  count: number
  fields: string[]
  rows: string[][]
}

export type CasPreviewCatalog = {
  fields: string[]
  attributes: string[][]
  markers: Marker[]
  baseColor?: V4
}

class CasPreviewParseError extends Error { }

export function casPreviewToCatalog(preview: CasPreview): CasPreviewCatalog {
  const fields = [...preview.fields]
  const attributes = preview.rows.map(row => [...row])
  const [raCol, decCol] = findCoordsCols(fields)
  const colorCol = fields.indexOf('color')
  const markerTypeCol = fields.indexOf('marker_type')

  const markers: Marker[] = attributes.map(row => ({
    position: SkyCoord.fromDeg(Number(row[raCol]), Number(row[decCol])).xyz,
    color: colorCol >= 0 && row[colorCol] ? hexToRgba(row[colorCol], CasPreviewParseError) : undefined,
    type: markerTypeCol >= 0 && row[markerTypeCol] ? checkMarkerType(row[markerTypeCol]) : undefined,
  }))

  return {
    fields,
    attributes,
    markers,
    baseColor: colorCol >= 0 ? [1, 1, 1, 1] as V4 : undefined,
  }
}

function findCoordsCols(fields: string[]): [number, number] {
  const lowerCaseFields = fields.map(field => field.toLowerCase())
  for (const [ra, dec] of [['ra', 'dec'], ['ra2000', 'dec2000']] as const) {
    if (lowerCaseFields.includes(ra) && lowerCaseFields.includes(dec)) {
      return [lowerCaseFields.indexOf(ra), lowerCaseFields.indexOf(dec)]
    }
  }
  throw new CasPreviewParseError(`No coordinates field found: ${fields.join(', ')}`)
}

function checkMarkerType(markerType: string): MarkerType {
  if (markerTypes.includes(markerType as MarkerType)) {
    return markerType as MarkerType
  }
  throw new CasPreviewParseError(`Invalid marker_type: "${markerType}": allowed marker_type is one of ${markerTypes.join(', ')}`)
}
