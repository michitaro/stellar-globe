import { sqlFile } from '../types.js'
import type { BuildAppEnv } from '../types.js'

export const appConfig = {
  target: 'public',
  data: {
    u2k: false,
    la2016: false,
    la2020: false,
    pdr3: true,
    idr: false,
  },
  tractTileLayers: {
    includeInternalLayers: false,
    defaultVisibleDatasets: ['PDR3 Wide', 'PDR3 DUD'],
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      { name: 'pdr3' },
      { name: 'pdr3-citus-columnar' },
      { name: 'pdr2' },
      { name: 'pdr2-citus-columnar' },
      { name: 'chorus_pdr1' },
      { name: 'pdr1' },
    ],
    sampleQueries: [
      {
        id: 'primary-objects',
        name: 'Primary Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/public-release-3/primary_objects.sql', import.meta.url),
      },
      {
        id: 'clean-objects',
        name: 'Clean Objects',
        sql: sqlFile('../../src/app/features/cas/sampleQueries/public-release-3/clean_objects.sql', import.meta.url),
      },
    ],
  },
} satisfies BuildAppEnv
