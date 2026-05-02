import type { BuildAppEnv } from '../types.js'

export const appConfig = {
  target: 'u2k',
  data: {
    u2k: true,
    la2016: false,
    la2020: false,
    pdr3: false,
    idr: false,
  },
  tractTileLayers: {
    includeInternalLayers: true,
    defaultVisibleDatasets: ['U2K V2'],
  },
  cas: {
    enabled: false,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [],
    sampleQueries: [],
  },
} satisfies BuildAppEnv
