import { sqlFile } from '../types.js'
import type { BuildAppEnv } from '../types.js'

export const appConfig = {
  target: 'legacy-archive',
  data: {
    u2k: false,
    la2016: true,
    la2020: true,
    pdr3: false,
    idr: false,
  },
  tractTileLayers: {
    includeInternalLayers: true,
    defaultVisibleDatasets: ['PDR3 Wide', 'PDR3 DUD'],
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      { name: 'hscla2020' },
      { name: 'hscla2016' },
      { name: 'hscla2014' },
    ],
    sampleQueries: [
      {
        id: 'primary-objects',
        name: 'Primary Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/hscla/primary_objects.sql', import.meta.url),
      },
      {
        id: 'clean-objects',
        name: 'Clean Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/hscla/clean_objects.sql', import.meta.url),
      },
    ],
  },
} satisfies BuildAppEnv
