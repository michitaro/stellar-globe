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
  currentCatalogId: string | undefined
  catalogsDialogVisible: boolean
}


function initialState(): State {
  return {
    catalogs: [],
    autoColor: true,
    currentCatalogId: undefined,
    catalogsDialogVisible: false,
  }
}


export type CatalogAddedParams = {
  id?: string
  name: string
  markers: Marker[]
  fields: string[]
  attributes: string[][]
  hasColorCol: boolean
  hasMarkerTypeCol: boolean
  defaultType?: MarkerType
  defaultColor?: V4
}


export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: create => ({
    catalogAdded: create.preparedReducer(
      (params: CatalogAddedParams) => {
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
          const { name, markers, fields, attributes, hasColorCol, hasMarkerTypeCol } = params
          const catalog: Catalog = {
            id,
            name,
            hasColorCol,
            hasMarkerTypeCol,
            markers,
            fields,
            attributes,
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
        if (state.currentCatalogId === id) {
          state.currentCatalogId = undefined
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
    catalogSelected: create.reducer(
      (state, { payload: { id } }: { payload: { id: string } }) => {
        state.currentCatalogId = id
      },
    ),
    catalogsDialogToggled: create.reducer<{ open?: boolean }>((state, { payload: { open } }) => {
      state.catalogsDialogVisible = open ?? !state.catalogsDialogVisible
    }),
  }),
  selectors: {
    currentCatalog: state => state.catalogs.find(c => c.id === state.currentCatalogId),
  },
  extraReducers(builder) {
    builder.addCase(appStateHistoryActions.setState, (state, action) => {
      state.catalogs = action.payload.catalogs.catalogs
    })
    builder.addMatcher(
      action => [catalogsSlice.actions.catalogAdded.type].includes(action.type),
      state => {
        state.catalogsDialogVisible = true
      },
    )
    builder.addMatcher(
      action => [catalogsSlice.actions.catalogDeleted.type].includes(action.type),
      state => {
        if (state.catalogs.length === 0) {
          state.catalogsDialogVisible = false
        }
      },
    )
  },
})


class CatalogParseError extends Error { }


export function parseCatalogCsvText(csvText: string) {
  const parseResults = Papa.parse(csvText)

  if (parseResults.errors.length > 0) {
    throw new CatalogParseError(
      'CSV format error:\n' +
      parseResults.errors.map(e => `${e.message}${e.row ? `@line ${e.row}` : ``}`).join('\n')
    )
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


export type Marker = Parameters<typeof ClickableMarkerLayer$>[0]['markers'][number]


export type Catalog = {
  id: string
  name: string
  markers: Marker[]
  fields: string[]
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
