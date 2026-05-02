import { sqlFile } from '../types.js'
import type { BuildAppEnv } from '../types.js'

export const appConfig = {
  target: 'internal',
  data: {
    u2k: false,
    la2016: false,
    la2020: false,
    pdr3: false,
    idr: true,
  },
  tractTileLayers: {
    includeInternalLayers: true,
    defaultVisibleDatasets: ['s23b Wide', 's23b Deep'],
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      { name: 's23b_wide' },
      { name: 's23b_dud' },
    ],
    sampleQueries: [
      {
        id: 'primary-objects',
        name: 'Primary Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/internal-release/primary_objects.sql', import.meta.url),
      },
      {
        id: 'clean-objects',
        name: 'Clean Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/internal-release/clean_objects.sql', import.meta.url),
      },
    ],
  },
} satisfies BuildAppEnv
