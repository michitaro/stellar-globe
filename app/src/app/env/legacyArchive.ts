import { legacyArchiveCasSampleQueries } from './casSampleQueries'
import type { AppEnv } from './types'

export const legacyArchiveEnv: AppEnv = {
  target: 'legacy-archive',
  data: {
    u2k: false,
    la2016: true,
    la2020: true,
    pdr3: false,
    idr: false,
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      { name: 'hscla2020' },
      { name: 'hscla2016' },
      { name: 'hscla2014' },
    ],
    sampleQueries: legacyArchiveCasSampleQueries,
  },
}
