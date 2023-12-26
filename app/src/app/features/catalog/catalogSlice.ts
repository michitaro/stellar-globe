import { createSlice, nanoid } from "@reduxjs/toolkit"
import { ClickableMarkerLayer$ } from '@stellar-globe/react-stellar-globe'
import { MarkerType, SkyCoord, V4, markerTypes } from "@stellar-globe/stellar-globe"
import Papa from 'papaparse'
import { colorSeries } from '../../../common/utils/colorsys'
import { hexToRgba } from '../../../common/utils/hexToRgba'
import { appStateHistoryActions } from "../../store/hooks"
import { trackAction } from "../../store/stateHistory"


type State = {
  catalogs: Catalog[]
  autoColor: boolean
}

function initialState(): State {
  return {
    catalogs: [],
    autoColor: true,
  }
}


export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: create => ({
    csvTextSubmitted: create.preparedReducer(
      (params: { name: string, csvText: string, id?: string, defaultType?: MarkerType, defaultColor?: V4 }) => {
        const id = params.id ?? nanoid()
        return trackAction({
          payload: {
            id,
            params,
          }
        }, `Catalog ${params.name} Added`)
      },
      (state, { payload: { id, params } }) => {
        if (!state.catalogs.find(c => c.id === id)) {
          let parsedResults: ReturnType<typeof parseCsvText>
          try {
            parsedResults = parseCsvText(params.csvText)
          }
          catch (error) {
            alert(error)
            console.error(error)
            return
          }
          const { hasColorCol, hasMarkerTypeCol, ...contents } = parsedResults
          const catalog: Catalog = {
            id,
            hasColorCol,
            hasMarkerTypeCol,
            ...contents,
            name: params.name,
            baseColor: hasColorCol ? [1, 1, 1, 1] : nextColor(state),
            defaultType: params.defaultType ?? 'circle',
            defaultColor: params.defaultColor ?? [1, 1, 1, 1] as V4,
            visible: true,
          }
          state.catalogs.push(catalog)
        }
      },
    ),
    catalogDeleted: create.preparedReducer(
      (payload: { id: string }) => trackAction({ payload }, `Catalog Deleted`),
      (state, { payload: { id } }) => {
        const i = state.catalogs.findIndex(c => c.id === id)
        if (i >= 0) {
          state.catalogs.splice(i, 1)
        }
      },
    ),
    catalogUpdated: create.preparedReducer(
      (payload: Partial<Catalog> & { id: Catalog['id'] }) => trackAction({ payload }, `Catalog Updated`),
      (state, { payload: { id, ...rests } }) => {
        const catalog = state.catalogs.find(c => c.id === id)
        if (catalog) {
          Object.assign(catalog, rests)
        }
      },
    ),
  }),
  extraReducers(builder) {
    builder.addCase(appStateHistoryActions.setState, (state, action) => {
      state.catalogs = action.payload.catalogs.catalogs
    })
  },
})


class CatalogParseError extends Error { }


function parseCsvText(csvText: string) {
  const parseResults = Papa.parse(csvText)

  if (parseResults.errors.length > 0) {
    throw new CatalogParseError(parseResults.errors.join('\n'))
  }

  const rows = parseResults.data as string[][]

  // Determine field name with the last line that begins with '#'
  let dataRowBegin = 0
  let fields: string[] | undefined
  for (const row of rows) {
    if (!row[0].startsWith('#')) {
      break
    }
    ++dataRowBegin
    fields = row
  }

  if (fields === undefined) {
    throw new Error('No header row')
  }

  fields[0] = fields[0].replace(/^#\s*/, '')

  const [raCol, decCol] = findCoordsCols(fields)
  const colorCol = fields.indexOf('color')
  const markerTypeCol = fields.indexOf('marker_type')

  const attributes = rows.slice(dataRowBegin)
  // .filter(o => validNumberString(o[raCol]) && validNumberString(o[decCol]))

  const markers: Marker[] = attributes.map(o => {
    return {
      position: SkyCoord.fromDeg(Number(o[raCol]), Number(o[decCol])).xyz,
      color: colorCol >= 0 && o[colorCol] && hexToRgba(o[colorCol], CatalogParseError) || undefined,
      type: markerTypeCol >= 0 && o[markerTypeCol] && checkMarkerType(o[markerTypeCol]) || undefined,
    }
  })

  const parsed: Pick<Catalog, 'attributes' | 'fields' | 'markers' | 'hasColorCol' | 'hasMarkerTypeCol'> = {
    hasColorCol: colorCol >= 0,
    hasMarkerTypeCol: markerTypeCol >= 0,
    fields,
    attributes,
    markers,
  }
  return parsed
}


const markerTypesMap = Object.fromEntries(markerTypes.map(t => [t, t]))


function checkMarkerType(s: string): MarkerType {
  const t = markerTypesMap[s as any]
  if (!t) {
    throw new CatalogParseError(`Invalid marker_type: "${s}": allowed marker_type is one of ${markerTypes.join(', ')}`)
  }
  return t
}


// function validNumberString(s: string) {
//   return Number.isFinite(Number(s))
// }


function findCoordsCols(fields: string[]): [number, number] {
  fields = fields.map(f => f.toLowerCase())
  for (const [ra, dec] of [['ra', 'dec'], ['ra2000', 'dec2000']]) {
    if (fields.includes(ra) && fields.includes(dec)) {
      return [fields.indexOf(ra), fields.indexOf(dec)]
    }
  }
  throw new CatalogParseError(`No coordinates field found: ${fields.join(', ')}`)
}


type Marker = Parameters<typeof ClickableMarkerLayer$>[0]['markers'][number]


export type Catalog = {
  id: string
  name: string
  fields: string[]
  markers: Marker[]
  attributes: string[][]
  defaultType: MarkerType
  defaultColor: V4
  baseColor: V4
  visible: boolean
  hasColorCol: boolean
  hasMarkerTypeCol: boolean
}


function nextColor(state: State): V4 {
  if (state.autoColor || state.catalogs.length === 0) {
    return colorSeries(state.catalogs.length, { alpha: 0.75 })
  }
  return state.catalogs[state.catalogs.length - 1].baseColor
}
